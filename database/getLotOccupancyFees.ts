import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../types/recordTypes.js'

export async function getLotOccupancyFees(
  lotOccupancyId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.LotOccupancyFee[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  const lotOccupancyFees = database
    .prepare(
      `select o.lotOccupancyId, o.feeId,
        c.feeCategory, f.feeName,
        f.includeQuantity, o.feeAmount, o.taxAmount, o.quantity, f.quantityUnit
        from LotOccupancyFees o
        left join Fees f on o.feeId = f.feeId
        left join FeeCategories c on f.feeCategoryId = c.feeCategoryId
        where o.recordDelete_timeMillis is null
        and o.lotOccupancyId = ?
        order by o.recordCreate_timeMillis`
    )
    .all(lotOccupancyId) as recordTypes.LotOccupancyFee[]

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotOccupancyFees
}

export default getLotOccupancyFees
