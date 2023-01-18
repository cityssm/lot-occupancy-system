import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

export async function deleteLotOccupancyTransaction(
  lotOccupancyId: number | string,
  transactionIndex: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update LotOccupancyTransactions
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and transactionIndex = ?`
    )
    .run(
      requestSession.user!.userName,
      rightNowMillis,
      lotOccupancyId,
      transactionIndex
    )

  database.release()

  return result.changes > 0
}

export default deleteLotOccupancyTransaction
