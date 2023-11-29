import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../types/recordTypes.js'

export async function getFee(
  feeId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.Fee> {
  const database = connectedDatabase ?? (await acquireConnection())

  const fee = database
    .prepare(
      `select f.feeId,
        f.feeCategoryId, c.feeCategory,
        f.feeName, f.feeDescription, f.feeAccount,
        f.occupancyTypeId, o.occupancyType,
        f.lotTypeId, l.lotType,
        ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction,
        f.taxAmount, f.taxPercentage,
        f.includeQuantity, f.quantityUnit,
        f.isRequired, f.orderNumber
        from Fees f
        left join FeeCategories c on f.feeCategoryId = c.feeCategoryId
        left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId
        left join LotTypes l on f.lotTypeId = l.lotTypeId
        where f.recordDelete_timeMillis is null
        and f.feeId = ?`
    )
    .get(feeId) as recordTypes.Fee

  if (connectedDatabase === undefined) {
    database.release()
  }

  return fee
}

export default getFee
