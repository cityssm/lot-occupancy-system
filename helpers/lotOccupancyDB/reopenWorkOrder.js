import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const reopenWorkOrder = (workOrderId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update Maps" +
        " set workOrderCloseDate = null," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where workOrderId = ?" +
        " and workOrderCloseDate is not null")
        .run(requestSession.user.userName, rightNowMillis, workOrderId);
    database.close();
    return result.changes > 0;
};
export default reopenWorkOrder;
