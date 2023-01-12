import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { clearCacheByTableName } from '../functions.cache.js';
export function updateOccupancyTypeField(occupancyTypeFieldForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update OccupancyTypeFields
                set occupancyTypeField = ?,
                isRequired = ?,
                minimumLength = ?,
                maximumLength = ?,
                pattern = ?,
                occupancyTypeFieldValues = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where occupancyTypeFieldId = ?
                and recordDelete_timeMillis is null`)
        .run(occupancyTypeFieldForm.occupancyTypeField, Number.parseInt(occupancyTypeFieldForm.isRequired, 10), occupancyTypeFieldForm.minimumLength ?? 0, occupancyTypeFieldForm.maximumLength ?? 100, occupancyTypeFieldForm.pattern ?? '', occupancyTypeFieldForm.occupancyTypeFieldValues, requestSession.user.userName, rightNowMillis, occupancyTypeFieldForm.occupancyTypeFieldId);
    database.close();
    clearCacheByTableName('OccupancyTypeFields');
    return result.changes > 0;
}
export default updateOccupancyTypeField;
