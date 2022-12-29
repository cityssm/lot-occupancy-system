import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteLotField(lotId, lotTypeFieldId, requestSession, connectedDatabase) {
    const database = connectedDatabase || sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotId = ?
                and lotTypeFieldId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotId, lotTypeFieldId);
    if (!connectedDatabase) {
        database.close();
    }
    return result.changes > 0;
}
export default deleteLotField;
