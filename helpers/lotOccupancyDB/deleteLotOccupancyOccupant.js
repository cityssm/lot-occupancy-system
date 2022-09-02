import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteLotOccupancyOccupant = (lotOccupancyId, lotOccupantIndex, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotOccupancyOccupants" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyId = ?" +
        " and lotOccupantIndex = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, lotOccupantIndex);
    database.close();
    return result.changes > 0;
};
export default deleteLotOccupancyOccupant;
