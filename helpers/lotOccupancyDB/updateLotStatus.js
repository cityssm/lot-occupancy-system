import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotStatusesCache } from "../functions.cache.js";
export const updateLotStatus = (lotStatusForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotStatuses" +
        " set lotStatus = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where lotStatusId = ?" +
        " and recordDelete_timeMillis is null")
        .run(lotStatusForm.lotStatus, requestSession.user.userName, rightNowMillis, lotStatusForm.lotStatusId);
    database.close();
    clearLotStatusesCache();
    return result.changes > 0;
};
export default updateLotStatus;
