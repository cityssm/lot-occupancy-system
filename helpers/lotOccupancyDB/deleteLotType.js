import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export function deleteLotType(lotTypeId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let result;
    for (const tableName of ["LotTypeFields", "LotTypes"]) {
        result = database
            .prepare(`update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotTypeId = ?`)
            .run(requestSession.user.userName, rightNowMillis, lotTypeId);
    }
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
}
export default deleteLotType;
