import { acquireConnection } from './pool.js';
import { clearCacheByTableName } from '../functions.cache.js';
export async function updateLotTypeField(lotTypeFieldForm, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update LotTypeFields
        set lotTypeField = ?,
        isRequired = ?,
        minimumLength = ?,
        maximumLength = ?,
        pattern = ?,
        lotTypeFieldValues = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotTypeFieldId = ?
        and recordDelete_timeMillis is null`)
        .run(lotTypeFieldForm.lotTypeField, Number.parseInt(lotTypeFieldForm.isRequired, 10), lotTypeFieldForm.minimumLength ?? 0, lotTypeFieldForm.maximumLength ?? 100, lotTypeFieldForm.pattern ?? '', lotTypeFieldForm.lotTypeFieldValues, requestSession.user.userName, Date.now(), lotTypeFieldForm.lotTypeFieldId);
    database.release();
    clearCacheByTableName('LotTypeFields');
    return result.changes > 0;
}
export default updateLotTypeField;
