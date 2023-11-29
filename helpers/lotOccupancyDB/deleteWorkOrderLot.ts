import { acquireConnection } from './pool.js'

export async function deleteWorkOrderLot(
  workOrderId: number | string,
  lotId: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotId = ?`
    )
    .run(user.userName, Date.now(), workOrderId, lotId)

  database.release()

  return result.changes > 0
}

export default deleteWorkOrderLot
