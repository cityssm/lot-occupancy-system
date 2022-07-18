import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addLot = (lotForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into Lots (" +
        "lotName, lotTypeId, lotTypeStatusId," +
        " mapId, mapKey," +
        " lotLatitude, lotLongitude," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(lotForm.lotName, lotForm.lotTypeId, (lotForm.lotTypeStatusId === "" ? undefined : lotForm.lotTypeStatusId), (lotForm.mapId === "" ? undefined : lotForm.mapId), lotForm.mapKey, (lotForm.lotLatitude === "" ? undefined : lotForm.lotLatitude), (lotForm.lotLongitude === "" ? undefined : lotForm.lotLongitude), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
};
export default addLot;
