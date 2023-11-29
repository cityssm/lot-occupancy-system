import * as configFunctions from '../helpers/functions.config.js'

import { acquireConnection } from './pool.js'

export async function cleanupDatabase(
  user: User
): Promise<{ inactivatedRecordCount: number; purgedRecordCount: number }> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()
  const recordDeleteTimeMillisMin =
    rightNowMillis -
    configFunctions.getProperty('settings.adminCleanup.recordDeleteAgeDays') *
      86_400 *
      1000

  let inactivatedRecordCount = 0
  let purgedRecordCount = 0

  /*
   * Work Order Comments
   */

  inactivatedRecordCount += database
    .prepare(
      `update WorkOrderComments
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderId in (
          select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare('delete from WorkOrderComments where recordDelete_timeMillis <= ?')
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Order Lot Occupancies
   */

  inactivatedRecordCount += database
    .prepare(
      `update WorkOrderLotOccupancies
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderId in (
          select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from WorkOrderLotOccupancies where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Order Lots
   */

  inactivatedRecordCount += database
    .prepare(
      `update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderId in (
          select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare('delete from WorkOrderLots where recordDelete_timeMillis <= ?')
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Order Milestones
   */

  inactivatedRecordCount += database
    .prepare(
      `update WorkOrderMilestones
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderId in (
          select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from WorkOrderMilestones where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Orders
   */

  purgedRecordCount += database
    .prepare(
      `delete from WorkOrders
        where recordDelete_timeMillis <= ?
        and workOrderId not in (select workOrderId from WorkOrderComments)
        and workOrderId not in (select workOrderId from WorkOrderLotOccupancies)
        and workOrderId not in (select workOrderId from WorkOrderLots)
        and workOrderId not in (select workOrderId from WorkOrderMilestones)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Order Milestone Types
   */

  purgedRecordCount += database
    .prepare(
      `delete from WorkOrderMilestoneTypes
        where recordDelete_timeMillis <= ?
        and workOrderMilestoneTypeId not in (
          select workOrderMilestoneTypeId from WorkOrderMilestones)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Work Order Types
   */

  purgedRecordCount += database
    .prepare(
      `delete from WorkOrderTypes
        where recordDelete_timeMillis <= ?
        and workOrderTypeId not in (select workOrderTypeId from WorkOrders)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupancy Comments
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotOccupancyComments
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId in (
          select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from LotOccupancyComments where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupancy Fields
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotOccupancyFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId in (select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from LotOccupancyFields where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupancy Occupants
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotOccupancyOccupants
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId in (select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from LotOccupancyOccupants where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupancy Fees/Transactions
   * - Maintain financials, do not delete related.
   */

  purgedRecordCount += database
    .prepare('delete from LotOccupancyFees where recordDelete_timeMillis <= ?')
    .run(recordDeleteTimeMillisMin).changes

  purgedRecordCount += database
    .prepare(
      'delete from LotOccupancyTransactions where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupancies
   */

  purgedRecordCount += database
    .prepare(
      `delete from LotOccupancies
        where recordDelete_timeMillis <= ?
        and lotOccupancyId not in (select lotOccupancyId from LotOccupancyComments)
        and lotOccupancyId not in (select lotOccupancyId from LotOccupancyFees)
        and lotOccupancyId not in (select lotOccupancyId from LotOccupancyFields)
        and lotOccupancyId not in (select lotOccupancyId from LotOccupancyOccupants)
        and lotOccupancyId not in (select lotOccupancyId from LotOccupancyTransactions)
        and lotOccupancyId not in (select lotOccupancyId from WorkOrderLotOccupancies)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Fees
   */

  inactivatedRecordCount += database
    .prepare(
      `update Fees
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and feeCategoryId in (select feeCategoryId from FeeCategories where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      `delete from Fees
        where recordDelete_timeMillis <= ?
        and feeId not in (select feeId from LotOccupancyFees)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Fee Categories
   */

  purgedRecordCount += database
    .prepare(
      `delete from FeeCategories
        where recordDelete_timeMillis <= ?
        and feeCategoryId not in (select feeCategoryId from Fees)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Occupancy Type Fields
   */

  inactivatedRecordCount += database
    .prepare(
      `update OccupancyTypeFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and occupancyTypeId in (select occupancyTypeId from OccupancyTypes where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      `delete from OccupancyTypeFields
        where recordDelete_timeMillis <= ?
        and occupancyTypeFieldId not in (select occupancyTypeFieldId from LotOccupancyFields)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Occupancy Type Prints
   */

  inactivatedRecordCount += database
    .prepare(
      `update OccupancyTypePrints
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and occupancyTypeId in (select occupancyTypeId from OccupancyTypes where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      'delete from OccupancyTypePrints where recordDelete_timeMillis <= ?'
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Occupancy Types
   */

  purgedRecordCount += database
    .prepare(
      `delete from OccupancyTypes
        where recordDelete_timeMillis <= ?
        and occupancyTypeId not in (select occupancyTypeId from OccupancyTypeFields)
        and occupancyTypeId not in (select occupancyTypeId from OccupancyTypePrints)
        and occupancyTypeId not in (select occupancyTypeId from LotOccupancies)
        and occupancyTypeId not in (select occupancyTypeId from Fees)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Occupant Types
   */

  purgedRecordCount += database
    .prepare(
      `delete from LotOccupantTypes
        where recordDelete_timeMillis <= ?
        and lotOccupantTypeId not in (select lotOccupantTypeId from LotOccupancyOccupants)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Comments
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotComments
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotId in (select lotId from Lots where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare('delete from LotComments where recordDelete_timeMillis <= ?')
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Fields
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotId in (select lotId from Lots where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare('delete from LotFields where recordDelete_timeMillis <= ?')
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lots
   */

  inactivatedRecordCount += database
    .prepare(
      `update Lots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and mapId in (select mapId from Maps where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      `delete from Lots
        where recordDelete_timeMillis <= ?
        and lotId not in (select lotId from LotComments)
        and lotId not in (select lotId from LotFields)
        and lotId not in (select lotId from LotOccupancies)
        and lotId not in (select lotId from WorkOrderLots)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Statuses
   */

  purgedRecordCount += database
    .prepare(
      `delete from LotStatuses
        where recordDelete_timeMillis <= ?
        and lotStatusId not in (select lotStatusId from Lots)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Type Fields
   */

  inactivatedRecordCount += database
    .prepare(
      `update LotTypeFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotTypeId in (select lotTypeId from LotTypes where recordDelete_timeMillis is not null)`
    )
    .run(user.userName, rightNowMillis).changes

  purgedRecordCount += database
    .prepare(
      `delete from LotTypeFields
        where recordDelete_timeMillis <= ?
        and lotTypeFieldId not in (select lotTypeFieldId from LotFields)`
    )
    .run(recordDeleteTimeMillisMin).changes

  /*
   * Lot Types
   */

  purgedRecordCount += database
    .prepare(
      `delete from LotTypes
        where recordDelete_timeMillis <= ?
        and lotTypeId not in (select lotTypeId from Lots)`
    )
    .run(recordDeleteTimeMillisMin).changes

  database.release()

  return {
    inactivatedRecordCount,
    purgedRecordCount
  }
}

export default cleanupDatabase
