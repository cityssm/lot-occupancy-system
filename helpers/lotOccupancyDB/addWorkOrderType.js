import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderTypesCache } from "../functions.cache.js";
export const addWorkOrderType = (workOrderTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into WorkOrderTypes (" +
        "workOrderType, orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
        .run(workOrderTypeForm.workOrderType, (workOrderTypeForm.orderNumber || -1), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearWorkOrderTypesCache();
    return result.lastInsertRowid;
};
export default addWorkOrderType;
