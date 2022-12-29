import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearOccupancyTypesCache } from "../functions.cache.js";
export function deleteOccupancyType(occupancyTypeId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let result;
    for (const tableName of ["OccupancyTypePrints", "OccupancyTypeFields", "OccupancyTypes"]) {
        result = database
            .prepare(`update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where occupancyTypeId = ?`)
            .run(requestSession.user.userName, rightNowMillis, occupancyTypeId);
    }
    database.close();
    clearOccupancyTypesCache();
    return result.changes > 0;
}
export default deleteOccupancyType;
