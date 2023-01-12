import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import { clearCacheByTableName } from '../functions.cache.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupantTypeForm {
  lotOccupantTypeId: number | string
  lotOccupantType: string
  fontAwesomeIconClass?: string
}

export function updateLotOccupantType(
  lotOccupantTypeForm: UpdateLotOccupantTypeForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update LotOccupantTypes
                set lotOccupantType = ?,
                fontAwesomeIconClass = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where lotOccupantTypeId = ?
                and recordDelete_timeMillis is null`
    )
    .run(
      lotOccupantTypeForm.lotOccupantType,
      lotOccupantTypeForm.fontAwesomeIconClass ?? '',
      requestSession.user!.userName,
      rightNowMillis,
      lotOccupantTypeForm.lotOccupantTypeId
    )

  database.close()

  clearCacheByTableName('LotOccupantTypes')

  return result.changes > 0
}

export default updateLotOccupantType
