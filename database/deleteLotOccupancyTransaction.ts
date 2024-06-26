import { acquireConnection } from './pool.js'

export default async function deleteLotOccupancyTransaction(
  lotOccupancyId: number | string,
  transactionIndex: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyTransactions
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and transactionIndex = ?`
    )
    .run(user.userName, Date.now(), lotOccupancyId, transactionIndex)

  database.release()

  return result.changes > 0
}
