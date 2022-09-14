import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteWorkOrder = (workOrderId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update WorkOrders" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where workOrderId = ?")
        .run(requestSession.user.userName, rightNowMillis, workOrderId);
    database.close();
    return result.changes > 0;
};
export default deleteWorkOrder;
