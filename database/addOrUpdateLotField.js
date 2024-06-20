import { acquireConnection } from './pool.js';
export default async function addOrUpdateLotField(lotFieldForm, user, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const rightNowMillis = Date.now();
    let result = database
        .prepare(`update LotFields
        set lotFieldValue = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?,
        recordDelete_userName = null,
        recordDelete_timeMillis = null
        where lotId = ?
        and lotTypeFieldId = ?`)
        .run(lotFieldForm.lotFieldValue, user.userName, rightNowMillis, lotFieldForm.lotId, lotFieldForm.lotTypeFieldId);
    if (result.changes === 0) {
        result = database
            .prepare(`insert into LotFields (
          lotId, lotTypeFieldId, lotFieldValue,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?)`)
            .run(lotFieldForm.lotId, lotFieldForm.lotTypeFieldId, lotFieldForm.lotFieldValue, user.userName, rightNowMillis, user.userName, rightNowMillis);
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return result.changes > 0;
}
