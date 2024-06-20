import { acquireConnection } from './pool.js';
export default async function addOrUpdateLotOccupancyField(lotOccupancyFieldForm, user, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const rightNowMillis = Date.now();
    let result = database
        .prepare(`update LotOccupancyFields
        set lotOccupancyFieldValue = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?,
        recordDelete_userName = null,
        recordDelete_timeMillis = null
        where lotOccupancyId = ?
        and occupancyTypeFieldId = ?`)
        .run(lotOccupancyFieldForm.lotOccupancyFieldValue, user.userName, rightNowMillis, lotOccupancyFieldForm.lotOccupancyId, lotOccupancyFieldForm.occupancyTypeFieldId);
    if (result.changes === 0) {
        result = database
            .prepare(`insert into LotOccupancyFields (
          lotOccupancyId, occupancyTypeFieldId, lotOccupancyFieldValue,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?)`)
            .run(lotOccupancyFieldForm.lotOccupancyId, lotOccupancyFieldForm.occupancyTypeFieldId, lotOccupancyFieldForm.lotOccupancyFieldValue, user.userName, rightNowMillis, user.userName, rightNowMillis);
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return result.changes > 0;
}
