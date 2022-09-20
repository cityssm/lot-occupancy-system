import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteLot = (lotId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update Lots" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotId);
    database
        .prepare("update LotComments" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotId);
    database
        .prepare("update LotFields" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotId);
    database.close();
    return result.changes > 0;
};
export default deleteLot;
