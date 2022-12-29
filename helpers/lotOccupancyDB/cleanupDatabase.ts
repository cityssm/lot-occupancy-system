import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import * as configFunctions from "../functions.config.js";

import type * as recordTypes from "../../types/recordTypes";

export function cleanupDatabase(requestSession: recordTypes.PartialSession) {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();
    const recordDelete_timeMillisMin =
        rightNowMillis -
        configFunctions.getProperty("settings.adminCleanup.recordDeleteAgeDays") * 86_400 * 1000;

    let inactivedRecordCount = 0;
    let purgedRecordCount = 0;

    /*
     * Work Order Comments
     */

    inactivedRecordCount += database
        .prepare(
            `update WorkOrderComments
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and workOrderId in (
                    select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from WorkOrderComments where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Work Order Lot Occupancies
     */

    inactivedRecordCount += database
        .prepare(
            `update WorkOrderLotOccupancies
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and workOrderId in (
                    select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from WorkOrderLotOccupancies where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Work Order Lots
     */

    inactivedRecordCount += database
        .prepare(
            `update WorkOrderLots
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and workOrderId in (
                    select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from WorkOrderLots where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Work Order Milestones
     */

    inactivedRecordCount += database
        .prepare(
            `update WorkOrderMilestones
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and workOrderId in (
                    select workOrderId from WorkOrders where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from WorkOrderMilestones where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

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
        .run(recordDelete_timeMillisMin).changes;

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
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Work Order Types
     */

    purgedRecordCount += database
        .prepare(
            `delete from WorkOrderTypes
                where recordDelete_timeMillis <= ?
                and workOrderTypeId not in (select workOrderTypeId from WorkOrders)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Occupancy Comments
     */

    inactivedRecordCount += database
        .prepare(
            `update LotOccupancyComments
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotOccupancyId in (
                    select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from LotOccupancyComments where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Occupancy Fields
     */

    inactivedRecordCount += database
        .prepare(
            `update LotOccupancyFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotOccupancyId in (select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from LotOccupancyFields where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Occupancy Occupants
     */

    inactivedRecordCount += database
        .prepare(
            `update LotOccupancyOccupants
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotOccupancyId in (select lotOccupancyId from LotOccupancies where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from LotOccupancyOccupants where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Occupancy Fees/Transactions
     * - Maintain financials, do not delete related.
     */

    purgedRecordCount += database
        .prepare("delete from LotOccupancyFees where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    purgedRecordCount += database
        .prepare("delete from LotOccupancyTransactions where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

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
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Fees
     */

    inactivedRecordCount += database
        .prepare(
            `update Fees
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and feeCategoryId in (select feeCategoryId from FeeCategories where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare(
            `delete from Fees
                where recordDelete_timeMillis <= ?
                and feeId not in (select feeId from LotOccupancyFees)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Fee Categories
     */

    purgedRecordCount += database
        .prepare(
            `delete from FeeCategories
                where recordDelete_timeMillis <= ?
                and feeCategoryId not in (select feeCategoryId from Fees)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Occupancy Type Fields
     */

    inactivedRecordCount += database
        .prepare(
            `update OccupancyTypeFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and occupancyTypeId in (select occupancyTypeId from OccupancyTypes where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare(
            `delete from OccupancyTypeFields
                where recordDelete_timeMillis <= ?
                and occupancyTypeFieldId not in (select occupancyTypeFieldId from LotOccupancyFields)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Occupancy Type Prints
     */

    inactivedRecordCount += database
        .prepare(
            `update OccupancyTypePrints
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and occupancyTypeId in (select occupancyTypeId from OccupancyTypes where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from OccupancyTypePrints where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

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
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Occupant Types
     */

    purgedRecordCount += database
        .prepare(
            `delete from LotOccupantTypes
                where recordDelete_timeMillis <= ?
                and lotOccupantTypeId not in (select lotOccupantTypeId from LotOccupancyOccupants)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Comments
     */

    inactivedRecordCount += database
        .prepare(
            `update LotComments
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotId in (select lotId from Lots where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from LotComments where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Fields
     */

    inactivedRecordCount += database
        .prepare(
            `update LotFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotId in (select lotId from Lots where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare("delete from LotFields where recordDelete_timeMillis <= ?")
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lots
     */

    inactivedRecordCount += database
        .prepare(
            `update Lots
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and mapId in (select mapId from Maps where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare(
            `delete from Lots
                where recordDelete_timeMillis <= ?
                and lotId not in (select lotId from LotComments)
                and lotId not in (select lotId from LotFields)
                and lotId not in (select lotId from LotOccupancies)
                and lotId not in (select lotId from WorkOrderLots)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Statuses
     */

    purgedRecordCount += database
        .prepare(
            `delete from LotStatuses
                where recordDelete_timeMillis <= ?
                and lotStatusId not in (select lotStatusId from Lots)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Type Fields
     */

    inactivedRecordCount += database
        .prepare(
            `update LotTypeFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotTypeId in (select lotTypeId from LotTypes where recordDelete_timeMillis is not null)`
        )
        .run(requestSession.user.userName, rightNowMillis).changes;

    purgedRecordCount += database
        .prepare(
            `delete from LotTypeFields
                where recordDelete_timeMillis <= ?
                and lotTypeFieldId not in (select lotTypeFieldId from LotFields)`
        )
        .run(recordDelete_timeMillisMin).changes;

    /*
     * Lot Types
     */

    purgedRecordCount += database
        .prepare(
            `delete from LotTypes
                where recordDelete_timeMillis <= ?
                and lotTypeId not in (select lotTypeId from Lots)`
        )
        .run(recordDelete_timeMillisMin).changes;

    database.close();

    return {
        inactivedRecordCount,
        purgedRecordCount
    };
}

export default cleanupDatabase;
