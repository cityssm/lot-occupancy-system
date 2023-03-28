import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteWorkOrderLotOccupancy(
  workOrderId: number | string,
  lotOccupancyId: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update WorkOrderLotOccupancies
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotOccupancyId = ?`
    )
    .run(requestSession.user!.userName, Date.now(), workOrderId, lotOccupancyId)

  database.release()

  return result.changes > 0
}

export default deleteWorkOrderLotOccupancy
