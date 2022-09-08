import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
export const addWorkOrderMilestoneType = (workOrderMilestoneTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into WorkOrderMilestoneTypes (" +
        "workOrderMilestoneType, orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
        .run(workOrderMilestoneTypeForm.workOrderMilestoneType, workOrderMilestoneTypeForm.orderNumber || -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return result.lastInsertRowid;
};
export default addWorkOrderMilestoneType;
