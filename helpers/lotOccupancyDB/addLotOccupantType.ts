import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'
import { clearCacheByTableName } from '../functions.cache.js'

interface AddLotOccupantTypeForm {
  lotOccupantType: string
  fontAwesomeIconClass?: string
  orderNumber?: number
}

export function addLotOccupantType(
  lotOccupantTypeForm: AddLotOccupantTypeForm,
  requestSession: recordTypes.PartialSession
): number {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into LotOccupantTypes (
                lotOccupantType, fontAwesomeIconClass, orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupantTypeForm.lotOccupantType,
      lotOccupantTypeForm.fontAwesomeIconClass ?? '',
      lotOccupantTypeForm.orderNumber ?? -1,
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  database.close()

  clearCacheByTableName('LotOccupantTypes')

  return result.lastInsertRowid as number
}

export default addLotOccupantType
