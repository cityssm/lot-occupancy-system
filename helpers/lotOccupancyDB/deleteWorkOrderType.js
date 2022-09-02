import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderTypesCache } from "../functions.cache.js";
export const deleteWorkOrderType = (workOrderTypeId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update WorkOrderTypes" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where workOrderTypeId = ?")
        .run(requestSession.user.userName, rightNowMillis, workOrderTypeId);
    database.close();
    clearWorkOrderTypesCache();
    return result.changes > 0;
};
export default deleteWorkOrderType;
