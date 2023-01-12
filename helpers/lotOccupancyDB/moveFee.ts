import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import { getFee } from './getFee.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

export function moveFeeDown(feeId: number | string): boolean {
  const database = sqlite(databasePath)

  const currentFee = getFee(feeId, database)

  database
    .prepare(
      `update Fees
        set orderNumber = orderNumber - 1
        where recordDelete_timeMillis is null
        and feeCategoryId = ?
        and orderNumber = ? + 1`
    )
    .run(currentFee.feeCategoryId, currentFee.orderNumber)

  const success = updateRecordOrderNumber(
    'Fees',
    feeId,
    currentFee.orderNumber! + 1,
    database
  )

  database.close()

  return success
}

export function moveFeeDownToBottom(feeId: number | string): boolean {
  const database = sqlite(databasePath)

  const currentFee = getFee(feeId, database)

  const maxOrderNumber: number = database
    .prepare(
      `select max(orderNumber) as maxOrderNumber
                from Fees
                where recordDelete_timeMillis is null
                and feeCategoryId = ?`
    )
    .get(currentFee.feeCategoryId).maxOrderNumber

  if (currentFee.orderNumber !== maxOrderNumber) {
    updateRecordOrderNumber('Fees', feeId, maxOrderNumber + 1, database)

    database
      .prepare(
        `update Fees
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and feeCategoryId = ? and orderNumber > ?`
      )
      .run(currentFee.feeCategoryId, currentFee.orderNumber)
  }

  database.close()

  return true
}

export function moveFeeUp(feeId: number): boolean {
  const database = sqlite(databasePath)

  const currentFee = getFee(feeId, database)

  if (currentFee.orderNumber! <= 0) {
    database.close()
    return true
  }

  database
    .prepare(
      `update Fees
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and feeCategoryId = ?
                and orderNumber = ? - 1`
    )
    .run(currentFee.feeCategoryId, currentFee.orderNumber)

  const success = updateRecordOrderNumber(
    'Fees',
    feeId,
    currentFee.orderNumber! - 1,
    database
  )

  database.close()

  return success
}

export function moveFeeUpToTop(feeId: number | string): boolean {
  const database = sqlite(databasePath)

  const currentFee = getFee(feeId, database)

  if (currentFee.orderNumber! > 0) {
    updateRecordOrderNumber('Fees', feeId, -1, database)

    database
      .prepare(
        `update Fees
            set orderNumber = orderNumber + 1
            where recordDelete_timeMillis is null
            and feeCategoryId = ?
            and orderNumber < ?`
      )
      .run(currentFee.feeCategoryId, currentFee.orderNumber)
  }

  database.close()

  return true
}

export default moveFeeUp
