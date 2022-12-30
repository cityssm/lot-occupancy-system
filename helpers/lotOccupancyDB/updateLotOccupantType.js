import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotOccupantTypesCache } from "../functions.cache.js";
export function updateLotOccupantType(lotOccupantTypeForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupantTypes
                set lotOccupantType = ?,
                fontAwesomeIconClass = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where lotOccupantTypeId = ?
                and recordDelete_timeMillis is null`)
        .run(lotOccupantTypeForm.lotOccupantType, lotOccupantTypeForm.fontAwesomeIconClass || "", requestSession.user.userName, rightNowMillis, lotOccupantTypeForm.lotOccupantTypeId);
    database.close();
    clearLotOccupantTypesCache();
    return result.changes > 0;
}
export default updateLotOccupantType;
