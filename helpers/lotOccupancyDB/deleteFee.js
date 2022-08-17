import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteFee = (feeId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update Fees" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where feeId = ?")
        .run(requestSession.user.userName, rightNowMillis, feeId);
    database.close();
    return (result.changes > 0);
};
export default deleteFee;
