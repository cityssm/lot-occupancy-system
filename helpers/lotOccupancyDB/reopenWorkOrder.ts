import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function reopenWorkOrder(
  workOrderId: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update WorkOrders
        set workOrderCloseDate = null,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderId = ?
        and workOrderCloseDate is not null`
    )
    .run(requestSession.user!.userName, rightNowMillis, workOrderId)

  database.release()

  return result.changes > 0
}

export default reopenWorkOrder
