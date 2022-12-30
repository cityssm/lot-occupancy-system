import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function updateMap(mapForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update Maps
                set mapName = ?,
                mapDescription = ?,
                mapSVG = ?,
                mapLatitude = ?,
                mapLongitude = ?,
                mapAddress1 = ?,
                mapAddress2 = ?,
                mapCity = ?,
                mapProvince = ?,
                mapPostalCode = ?,
                mapPhoneNumber = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where mapId = ?
                and recordDelete_timeMillis is null`)
        .run(mapForm.mapName, mapForm.mapDescription, mapForm.mapSVG, mapForm.mapLatitude === "" ? undefined : mapForm.mapLatitude, mapForm.mapLongitude === "" ? undefined : mapForm.mapLongitude, mapForm.mapAddress1, mapForm.mapAddress2, mapForm.mapCity, mapForm.mapProvince, mapForm.mapPostalCode, mapForm.mapPhoneNumber, requestSession.user.userName, rightNowMillis, mapForm.mapId);
    database.close();
    return result.changes > 0;
}
export default updateMap;
