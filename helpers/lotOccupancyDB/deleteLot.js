import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteLot(lotId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let result;
    for (const tableName of ["LotFields", "LotComments", "Lots"]) {
        result = database
            .prepare(`update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotId = ?`)
            .run(requestSession.user.userName, rightNowMillis, lotId);
    }
    database.close();
    return result.changes > 0;
}
export default deleteLot;
