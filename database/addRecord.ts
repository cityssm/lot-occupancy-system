import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

type RecordTable =
  | 'LotStatuses'
  | 'LotTypes'
  | 'OccupancyTypes'
  | 'WorkOrderMilestoneTypes'
  | 'WorkOrderTypes'

const recordNameColumns = new Map<RecordTable, string>()
recordNameColumns.set('LotStatuses', 'lotStatus')
recordNameColumns.set('LotTypes', 'lotType')
recordNameColumns.set('OccupancyTypes', 'occupancyType')
recordNameColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneType')
recordNameColumns.set('WorkOrderTypes', 'workOrderType')

export async function addRecord(
  recordTable: RecordTable,
  recordName: string,
  orderNumber: number | string,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into ${recordTable} (
        ${recordNameColumns.get(recordTable)},
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?)`
    )
    .run(
      recordName,
      orderNumber === '' ? -1 : orderNumber,
      user.userName,
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  clearCacheByTableName(recordTable)

  return result.lastInsertRowid as number
}
