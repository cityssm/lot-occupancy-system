import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import * as cacheFunctions from "../functions.cache.js";
const recordIdColumns = new Map();
recordIdColumns.set("FeeCategories", "feeCategoryId");
recordIdColumns.set("Fees", "feeId");
recordIdColumns.set("Lots", "lotId");
recordIdColumns.set("LotComments", "lotCommentId");
recordIdColumns.set("LotOccupancies", "lotOccupancyId");
recordIdColumns.set("LotOccupancyComments", "lotOccupancyCommentId");
recordIdColumns.set("LotOccupantTypes", "lotOccupantTypeId");
recordIdColumns.set("LotStatuses", "lotStatusId");
recordIdColumns.set("LotTypes", "lotTypeId");
recordIdColumns.set("LotTypeFields", "lotTypeId");
recordIdColumns.set("Maps", "mapId");
recordIdColumns.set("OccupancyTypes", "occupancyTypeId");
recordIdColumns.set("OccupancyTypeFields", "occupancyTypeFieldId");
recordIdColumns.set("WorkOrders", "workOrderId");
recordIdColumns.set("WorkOrderComments", "workOrderCommentId");
recordIdColumns.set("WorkOrderMilestones", "workOrderMilestoneId");
recordIdColumns.set("WorkOrderMilestoneTypes", "workOrderMilestoneTypeId");
recordIdColumns.set("WorkOrderTypes", "workOrderTypeId");
const relatedTables = new Map();
relatedTables.set("FeeCategories", ["Fees"]);
relatedTables.set("Lots", ["LotFields", "LotComments"]);
relatedTables.set("LotOccupancies", ["LotOccupancyOccupants", "LotOccupancyFields", "LotOccupancyComments"]);
relatedTables.set("LotTypes", ["LotTypeFields"]);
relatedTables.set("Maps", ["Lots"]);
relatedTables.set("OccupancyTypes", ["OccupancyTypePrints", "OccupancyTypeFields"]);
relatedTables.set("WorkOrders", [
    "WorkOrderMilestones",
    "WorkOrderLots",
    "WorkOrderLotOccupancies",
    "WorkOrderComments"
]);
const clearCacheFunctions = new Map();
clearCacheFunctions.set("LotOccupantTypes", cacheFunctions.clearLotOccupantTypesCache);
clearCacheFunctions.set("LotStatuses", cacheFunctions.clearLotStatusesCache);
clearCacheFunctions.set("LotTypes", cacheFunctions.clearLotTypesCache);
clearCacheFunctions.set("LotTypeFields", cacheFunctions.clearLotTypesCache);
clearCacheFunctions.set("OccupancyTypes", cacheFunctions.clearOccupancyTypesCache);
clearCacheFunctions.set("OccupancyTypeFields", cacheFunctions.clearOccupancyTypesCache);
clearCacheFunctions.set("WorkOrderMilestoneTypes", cacheFunctions.clearWorkOrderMilestoneTypesCache);
clearCacheFunctions.set("WorkOrderTypes", cacheFunctions.clearWorkOrderTypesCache);
export function deleteRecord(recordTable, recordId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update ${recordTable}
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where ${recordIdColumns.get(recordTable)} = ?
                and recordDelete_timeMillis is null`)
        .run(requestSession.user.userName, rightNowMillis, recordId);
    for (const relatedTable of relatedTables.get(recordTable) || []) {
        database
            .prepare(`update ${relatedTable}
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where ${recordIdColumns.get(recordTable)} = ?
                and recordDelete_timeMillis is null`)
            .run(requestSession.user.userName, rightNowMillis, recordId);
    }
    database.close();
    if (clearCacheFunctions.has(recordTable)) {
        clearCacheFunctions.get(recordTable)();
    }
    return result.changes > 0;
}
