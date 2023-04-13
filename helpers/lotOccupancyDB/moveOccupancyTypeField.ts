import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import { clearCacheByTableName } from '../functions.cache.js'
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js'

function getCurrentField(
  occupancyTypeFieldId: number,
  connectedDatabase: PoolConnection
): { occupancyTypeId?: number; orderNumber: number } {
  const currentField = connectedDatabase
    .prepare(
      `select occupancyTypeId, orderNumber
          from OccupancyTypeFields
          where occupancyTypeFieldId = ?`
    )
    .get(occupancyTypeFieldId) as {
    occupancyTypeId?: number
    orderNumber: number
  }

  return currentField
}

export async function moveOccupancyTypeFieldDown(
  occupancyTypeFieldId: number
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(occupancyTypeFieldId, database)

  database
    .prepare(
      'update OccupancyTypeFields' +
        ' set orderNumber = orderNumber - 1' +
        ' where recordDelete_timeMillis is null' +
        (currentField.occupancyTypeId
          ? " and occupancyTypeId = '" +
            currentField.occupancyTypeId.toString() +
            "'"
          : ' and occupancyTypeId is null') +
        ' and orderNumber = ? + 1'
    )
    .run(currentField.orderNumber)

  const success = updateRecordOrderNumber(
    'OccupancyTypeFields',
    occupancyTypeFieldId,
    currentField.orderNumber + 1,
    database
  )

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return success
}

export async function moveOccupancyTypeFieldDownToBottom(
  occupancyTypeFieldId: number
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(occupancyTypeFieldId, database)

  const occupancyTypeParameters: unknown[] = []

  if (currentField.occupancyTypeId) {
    occupancyTypeParameters.push(currentField.occupancyTypeId)
  }

  const maxOrderNumber: number = (
    database
      .prepare(
        'select max(orderNumber) as maxOrderNumber' +
          ' from OccupancyTypeFields' +
          ' where recordDelete_timeMillis is null' +
          (currentField.occupancyTypeId
            ? ' and occupancyTypeId = ?'
            : ' and occupancyTypeId is null')
      )
      .get(occupancyTypeParameters) as { maxOrderNumber: number }
  ).maxOrderNumber

  if (currentField.orderNumber !== maxOrderNumber) {
    updateRecordOrderNumber(
      'OccupancyTypeFields',
      occupancyTypeFieldId,
      maxOrderNumber + 1,
      database
    )

    occupancyTypeParameters.push(currentField.orderNumber)

    database
      .prepare(
        'update OccupancyTypeFields' +
          ' set orderNumber = orderNumber - 1' +
          ' where recordDelete_timeMillis is null' +
          (currentField.occupancyTypeId
            ? ' and occupancyTypeId = ?'
            : ' and occupancyTypeId is null') +
          ' and orderNumber > ?'
      )
      .run(occupancyTypeParameters)
  }

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return true
}

export async function moveOccupancyTypeFieldUp(
  occupancyTypeFieldId: number
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(occupancyTypeFieldId, database)

  if (currentField.orderNumber <= 0) {
    database.release()
    return true
  }

  database
    .prepare(
      'update OccupancyTypeFields' +
        ' set orderNumber = orderNumber + 1' +
        ' where recordDelete_timeMillis is null' +
        (currentField.occupancyTypeId
          ? " and occupancyTypeId = '" +
            currentField.occupancyTypeId.toString() +
            "'"
          : ' and occupancyTypeId is null') +
        ' and orderNumber = ? - 1'
    )
    .run(currentField.orderNumber)

  const success = updateRecordOrderNumber(
    'OccupancyTypeFields',
    occupancyTypeFieldId,
    currentField.orderNumber - 1,
    database
  )

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return success
}

export async function moveOccupancyTypeFieldUpToTop(
  occupancyTypeFieldId: number
): Promise<boolean> {
  const database = await acquireConnection()

  const currentField = getCurrentField(occupancyTypeFieldId, database)

  if (currentField.orderNumber > 0) {
    updateRecordOrderNumber(
      'OccupancyTypeFields',
      occupancyTypeFieldId,
      -1,
      database
    )

    const occupancyTypeParameters: unknown[] = []

    if (currentField.occupancyTypeId) {
      occupancyTypeParameters.push(currentField.occupancyTypeId)
    }

    occupancyTypeParameters.push(currentField.orderNumber)

    database
      .prepare(
        'update OccupancyTypeFields' +
          ' set orderNumber = orderNumber + 1' +
          ' where recordDelete_timeMillis is null' +
          (currentField.occupancyTypeId
            ? ' and occupancyTypeId = ?'
            : ' and occupancyTypeId is null') +
          ' and orderNumber < ?'
      )
      .run(occupancyTypeParameters)
  }

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return true
}
