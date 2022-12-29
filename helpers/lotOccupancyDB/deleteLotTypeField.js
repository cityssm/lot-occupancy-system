import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export function deleteLotTypeField(lotTypeFieldId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotTypeFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotTypeFieldId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotTypeFieldId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
}
export default deleteLotTypeField;
