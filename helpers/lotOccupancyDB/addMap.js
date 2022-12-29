import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function addMap(mapForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into Maps (
                mapName, mapDescription,
                mapSVG, mapLatitude, mapLongitude,
                mapAddress1, mapAddress2,
                mapCity, mapProvince, mapPostalCode,
                mapPhoneNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(mapForm.mapName, mapForm.mapDescription, mapForm.mapSVG, mapForm.mapLatitude === "" ? undefined : mapForm.mapLatitude, mapForm.mapLongitude === "" ? undefined : mapForm.mapLongitude, mapForm.mapAddress1, mapForm.mapAddress2, mapForm.mapCity, mapForm.mapProvince, mapForm.mapPostalCode, mapForm.mapPhoneNumber, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
}
export default addMap;
