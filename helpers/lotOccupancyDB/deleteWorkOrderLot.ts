import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteWorkOrderLot(
  workOrderId: number | string,
  lotId: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotId = ?`
    )
    .run(requestSession.user!.userName, rightNowMillis, workOrderId, lotId)

  database.release()

  return result.changes > 0
}

export default deleteWorkOrderLot
