import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

export function deleteWorkOrderLotOccupancy(
  workOrderId: number | string,
  lotOccupancyId: number | string,
  requestSession: recordTypes.PartialSession
): boolean {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update WorkOrderLotOccupancies
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where workOrderId = ?
                and lotOccupancyId = ?`
    )
    .run(
      requestSession.user!.userName,
      rightNowMillis,
      workOrderId,
      lotOccupancyId
    )

  database.close()

  return result.changes > 0
}

export default deleteWorkOrderLotOccupancy
