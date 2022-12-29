import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteLotOccupancy(lotOccupancyId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let result;
    for (const tableName of [
        "LotOccupancyOccupants",
        "LotOccupancyFields",
        "LotOccupancyComments",
        "LotOccupancies"
    ]) {
        result = database
            .prepare(`update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotOccupancyId = ?`)
            .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    }
    database.close();
    return result.changes > 0;
}
export default deleteLotOccupancy;
