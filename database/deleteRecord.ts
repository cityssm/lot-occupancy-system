import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

type RecordTable =
  | 'FeeCategories'
  | 'Fees'
  | 'Lots'
  | 'LotComments'
  | 'LotOccupancies'
  | 'LotOccupancyComments'
  | 'LotOccupantTypes'
  | 'LotStatuses'
  | 'LotTypes'
  | 'LotTypeFields'
  | 'Maps'
  | 'OccupancyTypes'
  | 'OccupancyTypeFields'
  | 'WorkOrders'
  | 'WorkOrderComments'
  | 'WorkOrderMilestones'
  | 'WorkOrderMilestoneTypes'
  | 'WorkOrderTypes'

const recordIdColumns = new Map<RecordTable, string>()
recordIdColumns.set('FeeCategories', 'feeCategoryId')
recordIdColumns.set('Fees', 'feeId')
recordIdColumns.set('Lots', 'lotId')
recordIdColumns.set('LotComments', 'lotCommentId')
recordIdColumns.set('LotOccupancies', 'lotOccupancyId')
recordIdColumns.set('LotOccupancyComments', 'lotOccupancyCommentId')
recordIdColumns.set('LotOccupantTypes', 'lotOccupantTypeId')
recordIdColumns.set('LotStatuses', 'lotStatusId')
recordIdColumns.set('LotTypes', 'lotTypeId')
recordIdColumns.set('LotTypeFields', 'lotTypeId')
recordIdColumns.set('Maps', 'mapId')
recordIdColumns.set('OccupancyTypes', 'occupancyTypeId')
recordIdColumns.set('OccupancyTypeFields', 'occupancyTypeFieldId')
recordIdColumns.set('WorkOrders', 'workOrderId')
recordIdColumns.set('WorkOrderComments', 'workOrderCommentId')
recordIdColumns.set('WorkOrderMilestones', 'workOrderMilestoneId')
recordIdColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneTypeId')
recordIdColumns.set('WorkOrderTypes', 'workOrderTypeId')

const relatedTables = new Map<RecordTable, string[]>()
relatedTables.set('FeeCategories', ['Fees'])
relatedTables.set('Lots', ['LotFields', 'LotComments'])
relatedTables.set('LotOccupancies', [
  'LotOccupancyOccupants',
  'LotOccupancyFields',
  'LotOccupancyComments'
])
relatedTables.set('LotTypes', ['LotTypeFields'])
relatedTables.set('Maps', ['Lots'])
relatedTables.set('OccupancyTypes', [
  'OccupancyTypePrints',
  'OccupancyTypeFields'
])
relatedTables.set('WorkOrders', [
  'WorkOrderMilestones',
  'WorkOrderLots',
  'WorkOrderLotOccupancies',
  'WorkOrderComments'
])

export async function deleteRecord(
  recordTable: RecordTable,
  recordId: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update ${recordTable}
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where ${recordIdColumns.get(recordTable)!} = ?
        and recordDelete_timeMillis is null`
    )
    .run(user.userName, rightNowMillis, recordId)

  for (const relatedTable of relatedTables.get(recordTable) ?? []) {
    database
      .prepare(
        `update ${relatedTable}
          set recordDelete_userName = ?,
          recordDelete_timeMillis = ?
          where ${recordIdColumns.get(recordTable)!} = ?
          and recordDelete_timeMillis is null`
      )
      .run(user.userName, rightNowMillis, recordId)
  }

  database.release()

  clearCacheByTableName(recordTable)

  return result.changes > 0
}
