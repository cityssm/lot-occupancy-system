import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export interface AddOccupancyTypePrintForm {
  occupancyTypeId: string | number
  printEJS: string
  orderNumber?: number
}

export default async function addOccupancyTypePrint(
  occupancyTypePrintForm: AddOccupancyTypePrintForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  let result = database
    .prepare(
      `update OccupancyTypePrints
        set recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?,
        recordDelete_userName = null,
        recordDelete_timeMillis = null
        where occupancyTypeId = ?
        and printEJS = ?`
    )
    .run(
      user.userName,
      rightNowMillis,
      occupancyTypePrintForm.occupancyTypeId,
      occupancyTypePrintForm.printEJS
    )

  if (result.changes === 0) {
    result = database
      .prepare(
        `insert into OccupancyTypePrints (
          occupancyTypeId, printEJS, orderNumber,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        occupancyTypePrintForm.occupancyTypeId,
        occupancyTypePrintForm.printEJS,
        occupancyTypePrintForm.orderNumber ?? -1,
        user.userName,
        rightNowMillis,
        user.userName,
        rightNowMillis
      )
  }

  database.release()

  clearCacheByTableName('OccupancyTypePrints')

  return result.changes > 0
}
