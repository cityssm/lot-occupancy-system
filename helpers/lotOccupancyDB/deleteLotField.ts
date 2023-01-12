import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export function deleteLotField(
  lotId: number | string,
  lotTypeFieldId: number | string,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: sqlite.Database
): boolean {
  const database = connectedDatabase ?? sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update LotFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotId = ?
        and lotTypeFieldId = ?`
    )
    .run(requestSession.user!.userName, rightNowMillis, lotId, lotTypeFieldId)

  if (!connectedDatabase) {
    database.close()
  }

  return result.changes > 0
}

export default deleteLotField
