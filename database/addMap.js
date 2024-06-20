import { acquireConnection } from './pool.js';
export default async function addMap(mapForm, user) {
    const database = await acquireConnection();
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
        .run(mapForm.mapName, mapForm.mapDescription, mapForm.mapSVG, mapForm.mapLatitude === '' ? undefined : mapForm.mapLatitude, mapForm.mapLongitude === '' ? undefined : mapForm.mapLongitude, mapForm.mapAddress1, mapForm.mapAddress2, mapForm.mapCity, mapForm.mapProvince, mapForm.mapPostalCode, mapForm.mapPhoneNumber, user.userName, rightNowMillis, user.userName, rightNowMillis);
    database.release();
    return result.lastInsertRowid;
}
