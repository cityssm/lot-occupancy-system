import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
export const updateWorkOrderMilestoneType = (workOrderMilestoneTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update WorkOrderMilestoneTypes" +
        " set workOrderMilestoneType = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where workOrderMilestoneTypeId = ?" +
        " and recordDelete_timeMillis is null")
        .run(workOrderMilestoneTypeForm.workOrderMilestoneType, requestSession.user.userName, rightNowMillis, workOrderMilestoneTypeForm.workOrderMilestoneTypeId);
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return result.changes > 0;
};
export default updateWorkOrderMilestoneType;
