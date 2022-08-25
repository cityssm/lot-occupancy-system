import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderTypesCache } from "../functions.cache.js";
export const updateWorkOrderType = (workOrderTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update WorkOrderTypes" +
        " set workOrderType = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where workOrderTypeId = ?" +
        " and recordDelete_timeMillis is null")
        .run(workOrderTypeForm.workOrderType, requestSession.user.userName, rightNowMillis, workOrderTypeForm.workOrderTypeId);
    database.close();
    clearWorkOrderTypesCache();
    return result.changes > 0;
};
export default updateWorkOrderType;
