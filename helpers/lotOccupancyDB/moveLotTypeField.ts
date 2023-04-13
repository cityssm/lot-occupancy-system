import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import { clearCacheByTableName } from '../functions.cache.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

function getCurrentField(
  lotTypeFieldId: number | string,
  connectedDatabase: PoolConnection
): { lotTypeId?: number; orderNumber: number } {
  const currentField = connectedDatabase
    .prepare(
      'select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?'
    )
    .get(lotTypeFieldId) as { lotTypeId?: number; orderNumber: number }

  return currentField
}

export async function moveLotTypeFieldDown(
  lotTypeFieldId: number | string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(lotTypeFieldId, database)

  database
    .prepare(
      `update LotTypeFields
        set orderNumber = orderNumber - 1
        where recordDelete_timeMillis is null
        and lotTypeId = ? and orderNumber = ? + 1`
    )
    .run(currentField.lotTypeId, currentField.orderNumber)

  const success = updateRecordOrderNumber(
    'LotTypeFields',
    lotTypeFieldId,
    currentField.orderNumber + 1,
    database
  )

  database.release()

  clearCacheByTableName('LotTypeFields')

  return success
}

export async function moveLotTypeFieldDownToBottom(
  lotTypeFieldId: number | string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(lotTypeFieldId, database)

  const maxOrderNumber = (
    database
      .prepare(
        `select max(orderNumber) as maxOrderNumber
        from LotTypeFields
        where recordDelete_timeMillis is null
        and lotTypeId = ?`
      )
      .get(currentField.lotTypeId) as { maxOrderNumber: number }
  ).maxOrderNumber

  if (currentField.orderNumber !== maxOrderNumber) {
    updateRecordOrderNumber(
      'LotTypeFields',
      lotTypeFieldId,
      maxOrderNumber + 1,
      database
    )

    database
      .prepare(
        `update LotTypeFields
          set orderNumber = orderNumber - 1
          where recordDelete_timeMillis is null
          and lotTypeId = ?
          and orderNumber > ?`
      )
      .run(currentField.lotTypeId, currentField.orderNumber)
  }

  database.release()

  clearCacheByTableName('LotTypeFields')

  return true
}

export async function moveLotTypeFieldUp(
  lotTypeFieldId: number | string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(lotTypeFieldId, database)

  if (currentField.orderNumber <= 0) {
    database.release()
    return true
  }

  database
    .prepare(
      `update LotTypeFields
        set orderNumber = orderNumber + 1
        where recordDelete_timeMillis is null
        and lotTypeId = ?
        and orderNumber = ? - 1`
    )
    .run(currentField.lotTypeId, currentField.orderNumber)

  const success = updateRecordOrderNumber(
    'LotTypeFields',
    lotTypeFieldId,
    currentField.orderNumber - 1,
    database
  )

  database.release()

  clearCacheByTableName('LotTypeFields')

  return success
}

export async function moveLotTypeFieldUpToTop(
  lotTypeFieldId: number | string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(lotTypeFieldId, database)

  if (currentField.orderNumber > 0) {
    updateRecordOrderNumber('LotTypeFields', lotTypeFieldId, -1, database)

    database
      .prepare(
        `update LotTypeFields
            set orderNumber = orderNumber + 1
            where recordDelete_timeMillis is null
            and lotTypeId = ?
            and orderNumber < ?`
      )
      .run(currentField.lotTypeId, currentField.orderNumber)
  }

  database.release()

  clearCacheByTableName('LotTypeFields')

  return true
}
