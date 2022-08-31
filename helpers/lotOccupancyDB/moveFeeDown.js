import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const moveFeeDown = (feeId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database.prepare("select orderNumber" +
        " from Fees" +
        " where feeId = ?")
        .get(feeId)
        .orderNumber;
    database
        .prepare("update Fees" +
        " set orderNumber = orderNumber - 1" +
        " where recordDelete_timeMillis is null" +
        " and orderNumber = ? + 1")
        .run(currentOrderNumber);
    const result = database
        .prepare("update Fees" +
        " set orderNumber = ? + 1" +
        " where feeId = ?")
        .run(currentOrderNumber, feeId);
    database.close();
    return result.changes > 0;
};
export default moveFeeDown;
