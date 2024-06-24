import type { PoolConnection } from 'better-sqlite-pool'

import type { Fee } from '../types/recordTypes.js'

import { acquireConnection } from './pool.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

interface GetFeesFilters {
  occupancyTypeId?: number | string
  lotTypeId?: number | string
}

export default async function getFees(
  feeCategoryId: number,
  additionalFilters: GetFeesFilters,
  connectedDatabase?: PoolConnection
): Promise<Fee[]> {
  const updateOrderNumbers = !(
    additionalFilters.lotTypeId || additionalFilters.occupancyTypeId
  )

  const database = connectedDatabase ?? (await acquireConnection())

  let sqlWhereClause =
    ' where f.recordDelete_timeMillis is null and f.feeCategoryId = ?'

  const sqlParameters: unknown[] = [feeCategoryId]

  if (additionalFilters.occupancyTypeId) {
    sqlWhereClause +=
      ' and (f.occupancyTypeId is null or f.occupancyTypeId = ?)'

    sqlParameters.push(additionalFilters.occupancyTypeId)
  }

  if (additionalFilters.lotTypeId) {
    sqlWhereClause += ' and (f.lotTypeId is null or f.lotTypeId = ?)'

    sqlParameters.push(additionalFilters.lotTypeId)
  }

  const fees = database
    .prepare(
      `select f.feeId, f.feeCategoryId,
        f.feeName, f.feeDescription, f.feeAccount,
        f.occupancyTypeId, o.occupancyType,
        f.lotTypeId, l.lotType,
        ifnull(f.feeAmount, 0) as feeAmount,
        f.feeFunction,
        f.taxAmount, f.taxPercentage,
        f.includeQuantity, f.quantityUnit,
        f.isRequired, f.orderNumber,
        ifnull(lo.lotOccupancyFeeCount, 0) as lotOccupancyFeeCount
        from Fees f
        left join (
          select feeId, count(lotOccupancyId) as lotOccupancyFeeCount
          from LotOccupancyFees
          where recordDelete_timeMillis is null
          group by feeId
        ) lo on f.feeId = lo.feeId
        left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId
        left join LotTypes l on f.lotTypeId = l.lotTypeId
        ${sqlWhereClause}
        order by f.orderNumber, f.feeName`
    )
    .all(sqlParameters) as Fee[]

  if (updateOrderNumbers) {
    let expectedOrderNumber = 0

    for (const fee of fees) {
      if (fee.orderNumber !== expectedOrderNumber) {
        updateRecordOrderNumber(
          'Fees',
          fee.feeId,
          expectedOrderNumber,
          database
        )
        fee.orderNumber = expectedOrderNumber
      }

      expectedOrderNumber += 1
    }
  }

  if (connectedDatabase === undefined) {
    database.release()
  }

  return fees
}
