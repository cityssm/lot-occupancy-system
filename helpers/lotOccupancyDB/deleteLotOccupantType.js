import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotOccupantTypesCache } from "../functions.cache.js";
export function deleteLotOccupantType(lotOccupantTypeId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupantTypes
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotOccupantTypeId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotOccupantTypeId);
    database.close();
    clearLotOccupantTypesCache();
    return result.changes > 0;
}
export default deleteLotOccupantType;
