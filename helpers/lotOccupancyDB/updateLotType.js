import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export function updateLotType(lotTypeForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotTypes
                set lotType = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where lotTypeId = ?
                and recordDelete_timeMillis is null`)
        .run(lotTypeForm.lotType, requestSession.user.userName, rightNowMillis, lotTypeForm.lotTypeId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
}
export default updateLotType;
