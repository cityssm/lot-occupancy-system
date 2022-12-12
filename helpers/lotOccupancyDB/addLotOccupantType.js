import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotOccupantTypesCache } from "../functions.cache.js";
export const addLotOccupantType = (lotOccupantTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into LotOccupantTypes (" +
        "lotOccupantType, fontAwesomeIconClass, orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?)")
        .run(lotOccupantTypeForm.lotOccupantType, lotOccupantTypeForm.fontAwesomeIconClass || "", lotOccupantTypeForm.orderNumber || -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearLotOccupantTypesCache();
    return result.lastInsertRowid;
};
export default addLotOccupantType;
