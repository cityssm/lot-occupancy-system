import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteLotOccupancyFee(
  lotOccupancyId: number | string,
  feeId: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyFees
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and feeId = ?`
    )
    .run(requestSession.user!.userName, Date.now(), lotOccupancyId, feeId)

  database.release()

  return result.changes > 0
}

export default deleteLotOccupancyFee
