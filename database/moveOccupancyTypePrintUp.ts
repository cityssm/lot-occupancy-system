import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export async function moveOccupancyTypePrintUp(
  occupancyTypeId: number | string,
  printEJS: string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentOrderNumber = (
    database
      .prepare(
        'select orderNumber from OccupancyTypePrints where occupancyTypeId = ? and printEJS = ?'
      )
      .get(occupancyTypeId, printEJS) as { orderNumber: number }
  ).orderNumber

  if (currentOrderNumber <= 0) {
    database.release()
    return true
  }

  database
    .prepare(
      `update OccupancyTypePrints
        set orderNumber = orderNumber + 1
        where recordDelete_timeMillis is null
        and occupancyTypeId = ?
        and orderNumber = ? - 1`
    )
    .run(occupancyTypeId, currentOrderNumber)

  const result = database
    .prepare(
      'update OccupancyTypePrints set orderNumber = ? - 1 where occupancyTypeId = ? and printEJS = ?'
    )
    .run(currentOrderNumber, occupancyTypeId, printEJS)

  database.release()

  clearCacheByTableName('OccupancyTypePrints')

  return result.changes > 0
}

export async function moveOccupancyTypePrintUpToTop(
  occupancyTypeId: number | string,
  printEJS: string
): Promise<boolean> {
  const database = await acquireConnection()

  const currentOrderNumber = (
    database
      .prepare(
        'select orderNumber from OccupancyTypePrints where occupancyTypeId = ? and printEJS = ?'
      )
      .get(occupancyTypeId, printEJS) as { orderNumber: number }
  ).orderNumber

  if (currentOrderNumber > 0) {
    database
      .prepare(
        `update OccupancyTypePrints
          set orderNumber = -1
          where occupancyTypeId = ?
          and printEJS = ?`
      )
      .run(occupancyTypeId, printEJS)

    database
      .prepare(
        `update OccupancyTypePrints
          set orderNumber = orderNumber + 1
          where recordDelete_timeMillis is null
          and occupancyTypeId = ?
          and orderNumber < ?`
      )
      .run(occupancyTypeId, currentOrderNumber)
  }

  database.release()

  clearCacheByTableName('OccupancyTypePrints')

  return true
}

export default moveOccupancyTypePrintUp
