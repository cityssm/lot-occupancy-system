import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteMap = (mapId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update Maps" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where mapId = ?")
        .run(requestSession.user.userName, rightNowMillis, mapId);
    database.close();
    return (result.changes > 0);
};
export default deleteMap;
