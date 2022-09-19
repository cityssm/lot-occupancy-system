import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteLotOccupancy = (lotOccupancyId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotOccupancies" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    database
        .prepare("update LotOccupancyComments" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    database
        .prepare("update LotOccupancyFields" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    database
        .prepare("update LotOccupancyOccupants" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    database.close();
    return result.changes > 0;
};
export default deleteLotOccupancy;
