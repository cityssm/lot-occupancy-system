import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteLotOccupancyFee = (lotOccupancyId, feeId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotOccupancyFees" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?" +
        " and feeId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, feeId);
    database.close();
    return (result.changes > 0);
};
export default deleteLotOccupancyFee;
