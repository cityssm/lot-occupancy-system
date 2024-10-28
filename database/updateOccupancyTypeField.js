import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { acquireConnection } from './pool.js';
export default async function updateOccupancyTypeField(occupancyTypeFieldForm, user) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update OccupancyTypeFields
        set occupancyTypeField = ?,
        isRequired = ?,
        fieldType = ?,
        minimumLength = ?,
        maximumLength = ?,
        pattern = ?,
        occupancyTypeFieldValues = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where occupancyTypeFieldId = ?
        and recordDelete_timeMillis is null`)
        .run(occupancyTypeFieldForm.occupancyTypeField, Number.parseInt(occupancyTypeFieldForm.isRequired, 10), occupancyTypeFieldForm.fieldType ?? 'text', occupancyTypeFieldForm.minimumLength ?? 0, occupancyTypeFieldForm.maximumLength ?? 100, occupancyTypeFieldForm.pattern ?? '', occupancyTypeFieldForm.occupancyTypeFieldValues, user.userName, Date.now(), occupancyTypeFieldForm.occupancyTypeFieldId);
    database.release();
    clearCacheByTableName('OccupancyTypeFields');
    return result.changes > 0;
}
