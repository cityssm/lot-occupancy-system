import {
  type DateString,
  type TimeString,
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface UpdateLotOccupancyTransactionForm {
  lotOccupancyId: string | number
  transactionIndex: string | number
  transactionDateString: DateString
  transactionTimeString: TimeString
  transactionAmount: string | number
  externalReceiptNumber: string
  transactionNote: string
}

export default async function updateLotOccupancyTransaction(
  lotOccupancyTransactionForm: UpdateLotOccupancyTransactionForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyTransactions
        set transactionAmount = ?,
        externalReceiptNumber = ?,
        transactionNote = ?,
        transactionDate = ?,
        transactionTime = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        and transactionIndex = ?`
    )
    .run(
      lotOccupancyTransactionForm.transactionAmount,
      lotOccupancyTransactionForm.externalReceiptNumber,
      lotOccupancyTransactionForm.transactionNote,
      dateStringToInteger(lotOccupancyTransactionForm.transactionDateString),
      timeStringToInteger(lotOccupancyTransactionForm.transactionTimeString),
      user.userName,
      Date.now(),
      lotOccupancyTransactionForm.lotOccupancyId,
      lotOccupancyTransactionForm.transactionIndex
    )

  database.release()

  return result.changes > 0
}
