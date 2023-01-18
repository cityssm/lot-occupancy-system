import { acquireConnection } from './pool.js'

import { clearCacheByTableName } from '../functions.cache.js'

import type * as recordTypes from '../../types/recordTypes'

interface OccupancyTypePrintForm {
  occupancyTypeId: string | number
  printEJS: string
  orderNumber?: number
}

export async function addOccupancyTypePrint(
  occupancyTypePrintForm: OccupancyTypePrintForm,
  requestSession: recordTypes.PartialSession
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
      requestSession.user!.userName,
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
        requestSession.user!.userName,
        rightNowMillis,
        requestSession.user!.userName,
        rightNowMillis
      )
  }

  database.release()

  clearCacheByTableName('OccupancyTypePrints')

  return result.changes > 0
}

export default addOccupancyTypePrint
