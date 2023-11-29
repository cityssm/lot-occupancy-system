import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

interface AddLotOccupancyTransactionForm {
  lotOccupancyId: string | number
  transactionDateString?: string
  transactionTimeString?: string
  transactionAmount: string | number
  externalReceiptNumber: string
  transactionNote: string
}

export async function addLotOccupancyTransaction(
  lotOccupancyTransactionForm: AddLotOccupancyTransactionForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  let transactionIndex = 0

  const maxIndexResult = database
    .prepare(
      `select transactionIndex
        from LotOccupancyTransactions
        where lotOccupancyId = ?
        order by transactionIndex desc
        limit 1`
    )
    .get(lotOccupancyTransactionForm.lotOccupancyId) as
    | { transactionIndex: number }
    | undefined

  if (maxIndexResult !== undefined) {
    transactionIndex = maxIndexResult.transactionIndex + 1
  }

  const rightNow = new Date()

  const transactionDate = lotOccupancyTransactionForm.transactionDateString
    ? dateStringToInteger(lotOccupancyTransactionForm.transactionDateString)
    : dateToInteger(rightNow)

  const transactionTime = lotOccupancyTransactionForm.transactionTimeString
    ? timeStringToInteger(lotOccupancyTransactionForm.transactionTimeString)
    : dateToTimeInteger(rightNow)

  database
    .prepare(
      `insert into LotOccupancyTransactions (
        lotOccupancyId, transactionIndex,
        transactionDate, transactionTime,
        transactionAmount, externalReceiptNumber, transactionNote,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupancyTransactionForm.lotOccupancyId,
      transactionIndex,
      transactionDate,
      transactionTime,
      lotOccupancyTransactionForm.transactionAmount,
      lotOccupancyTransactionForm.externalReceiptNumber,
      lotOccupancyTransactionForm.transactionNote,
      user.userName,
      rightNow.getTime(),
      user.userName,
      rightNow.getTime()
    )

  database.release()

  return transactionIndex
}

export default addLotOccupancyTransaction
