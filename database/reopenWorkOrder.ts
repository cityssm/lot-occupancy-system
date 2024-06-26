import { acquireConnection } from './pool.js'

export default async function reopenWorkOrder(
  workOrderId: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update WorkOrders
        set workOrderCloseDate = null,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderId = ?
        and workOrderCloseDate is not null`
    )
    .run(user.userName, Date.now(), workOrderId)

  database.release()

  return result.changes > 0
}
