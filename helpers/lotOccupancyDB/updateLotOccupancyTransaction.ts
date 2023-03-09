import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupancyTransactionForm {
  lotOccupancyId: string | number
  transactionIndex: string | number
  transactionDateString: string
  transactionTimeString: string
  transactionAmount: string | number
  externalReceiptNumber: string
  transactionNote: string
}

export async function updateLotOccupancyTransaction(
  lotOccupancyTransactionForm: UpdateLotOccupancyTransactionForm,
  requestSession: recordTypes.PartialSession
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
      requestSession.user!.userName,
      Date.now(),
      lotOccupancyTransactionForm.lotOccupancyId,
      lotOccupancyTransactionForm.transactionIndex
    )

  database.release()

  return result.changes > 0
}

export default updateLotOccupancyTransaction
