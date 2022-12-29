import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteLotComment(lotCommentId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotComments
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotCommentId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotCommentId);
    database.close();
    return result.changes > 0;
}
export default deleteLotComment;
