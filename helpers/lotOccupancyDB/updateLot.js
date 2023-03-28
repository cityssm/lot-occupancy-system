import { acquireConnection } from './pool.js';
import { addOrUpdateLotField } from './addOrUpdateLotField.js';
import { deleteLotField } from './deleteLotField.js';
export async function updateLot(lotForm, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update Lots
        set lotName = ?,
        lotTypeId = ?,
        lotStatusId = ?,
        mapId = ?,
        mapKey = ?,
        lotLatitude = ?,
        lotLongitude = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotId = ?
        and recordDelete_timeMillis is null`)
        .run(lotForm.lotName, lotForm.lotTypeId, lotForm.lotStatusId === '' ? undefined : lotForm.lotStatusId, lotForm.mapId === '' ? undefined : lotForm.mapId, lotForm.mapKey, lotForm.lotLatitude === '' ? undefined : lotForm.lotLatitude, lotForm.lotLongitude === '' ? undefined : lotForm.lotLongitude, requestSession.user.userName, Date.now(), lotForm.lotId);
    if (result.changes > 0) {
        const lotTypeFieldIds = (lotForm.lotTypeFieldIds ?? '').split(',');
        for (const lotTypeFieldId of lotTypeFieldIds) {
            const lotFieldValue = lotForm['lotFieldValue_' + lotTypeFieldId];
            await ((lotFieldValue ?? '') === ''
                ? deleteLotField(lotForm.lotId, lotTypeFieldId, requestSession, database)
                : addOrUpdateLotField({
                    lotId: lotForm.lotId,
                    lotTypeFieldId,
                    lotFieldValue: lotFieldValue
                }, requestSession, database));
        }
    }
    database.release();
    return result.changes > 0;
}
export async function updateLotStatus(lotId, lotStatusId, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update Lots
        set lotStatusId = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotId = ?
        and recordDelete_timeMillis is null`)
        .run(lotStatusId === '' ? undefined : lotStatusId, requestSession.user.userName, rightNowMillis, lotId);
    database.release();
    return result.changes > 0;
}
export default updateLot;
