import { acquireConnection } from './pool.js';
import { addOrUpdateLotField } from './addOrUpdateLotField.js';
export async function addLot(lotForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into Lots (
        lotName, lotTypeId, lotStatusId,
        mapId, mapKey,
        lotLatitude, lotLongitude,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotForm.lotName, lotForm.lotTypeId, lotForm.lotStatusId === '' ? undefined : lotForm.lotStatusId, lotForm.mapId === '' ? undefined : lotForm.mapId, lotForm.mapKey, lotForm.lotLatitude === '' ? undefined : lotForm.lotLatitude, lotForm.lotLongitude === '' ? undefined : lotForm.lotLongitude, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    const lotId = result.lastInsertRowid;
    const lotTypeFieldIds = (lotForm.lotTypeFieldIds ?? '').split(',');
    for (const lotTypeFieldId of lotTypeFieldIds) {
        const lotFieldValue = lotForm['lotFieldValue_' + lotTypeFieldId];
        if ((lotFieldValue ?? '') !== '') {
            await addOrUpdateLotField({
                lotId,
                lotTypeFieldId,
                lotFieldValue
            }, requestSession, database);
        }
    }
    database.release();
    return lotId;
}
export default addLot;
