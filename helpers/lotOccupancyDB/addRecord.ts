import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'
import { clearCacheByTableName } from '../functions.cache.js'

type RecordTable =
  | 'FeeCategories'
  | 'LotStatuses'
  | 'LotTypes'
  | 'OccupancyTypes'
  | 'WorkOrderMilestoneTypes'
  | 'WorkOrderTypes'

const recordNameColumns: Map<RecordTable, string> = new Map()
recordNameColumns.set('FeeCategories', 'feeCategory')
recordNameColumns.set('LotStatuses', 'lotStatus')
recordNameColumns.set('LotTypes', 'lotType')
recordNameColumns.set('OccupancyTypes', 'occupancyType')
recordNameColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneType')
recordNameColumns.set('WorkOrderTypes', 'workOrderType')

export function addRecord(
  recordTable: RecordTable,
  recordName: string,
  orderNumber: number | string,
  requestSession: recordTypes.PartialSession
): number {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into ${recordTable} (
        ${recordNameColumns.get(recordTable)!},
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?)`
    )
    .run(
      recordName,
      orderNumber === '' ? -1 : orderNumber,
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  database.close()

  clearCacheByTableName(recordTable)

  return result.lastInsertRowid as number
}
