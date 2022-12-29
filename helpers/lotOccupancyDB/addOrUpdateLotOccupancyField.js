import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function addOrUpdateLotOccupancyField(lotOccupancyFieldForm, requestSession, connectedDatabase) {
    const database = connectedDatabase || sqlite(databasePath);
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
        .run(lotOccupancyFieldForm.lotOccupancyFieldValue, requestSession.user.userName, rightNowMillis, lotOccupancyFieldForm.lotOccupancyId, lotOccupancyFieldForm.occupancyTypeFieldId);
    if (result.changes === 0) {
        result = database
            .prepare(`insert into LotOccupancyFields (
                    lotOccupancyId, occupancyTypeFieldId, lotOccupancyFieldValue,
                    recordCreate_userName, recordCreate_timeMillis,
                    recordUpdate_userName, recordUpdate_timeMillis)
                    values (?, ?, ?, ?, ?, ?, ?)`)
            .run(lotOccupancyFieldForm.lotOccupancyId, lotOccupancyFieldForm.occupancyTypeFieldId, lotOccupancyFieldForm.lotOccupancyFieldValue, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    }
    if (!connectedDatabase) {
        database.close();
    }
    return result.changes > 0;
}
export default addOrUpdateLotOccupancyField;
