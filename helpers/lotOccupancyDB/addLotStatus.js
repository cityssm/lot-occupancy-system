import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotStatusesCache } from "../functions.cache.js";
export const addLotStatus = (lotStatusForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into LotStatuses (" +
        "lotStatus, orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
        .run(lotStatusForm.lotStatus, (lotStatusForm.orderNumber || 0), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearLotStatusesCache();
    return result.lastInsertRowid;
};
export default addLotStatus;
