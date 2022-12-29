import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteWorkOrderComment(workOrderCommentId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderComments
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where workOrderCommentId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderCommentId);
    database.close();
    return result.changes > 0;
}
export default deleteWorkOrderComment;
