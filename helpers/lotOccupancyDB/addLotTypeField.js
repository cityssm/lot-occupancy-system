import { acquireConnection } from './pool.js';
import { clearCacheByTableName } from '../functions.cache.js';
export async function addLotTypeField(lotTypeFieldForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into LotTypeFields (
        lotTypeId, lotTypeField, lotTypeFieldValues,
        isRequired, pattern,
        minimumLength, maximumLength,
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotTypeFieldForm.lotTypeId, lotTypeFieldForm.lotTypeField, lotTypeFieldForm.lotTypeFieldValues ?? '', lotTypeFieldForm.isRequired === '' ? 0 : 1, lotTypeFieldForm.pattern ?? '', lotTypeFieldForm.minimumLength ?? 0, lotTypeFieldForm.maximumLength ?? 100, lotTypeFieldForm.orderNumber ?? -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.release();
    clearCacheByTableName('LotTypeFields');
    return result.lastInsertRowid;
}
export default addLotTypeField;
