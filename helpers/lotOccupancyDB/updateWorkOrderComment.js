import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export function updateWorkOrderComment(commentForm, requestSession) {
    const rightNowMillis = Date.now();
    const database = sqlite(databasePath);
    const result = database
        .prepare(`update WorkOrderComments
                set workOrderCommentDate = ?,
                workOrderCommentTime = ?,
                workOrderComment = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where recordDelete_timeMillis is null
                and workOrderCommentId = ?`)
        .run(dateStringToInteger(commentForm.workOrderCommentDateString), timeStringToInteger(commentForm.workOrderCommentTimeString), commentForm.workOrderComment, requestSession.user.userName, rightNowMillis, commentForm.workOrderCommentId);
    database.close();
    return result.changes > 0;
}
export default updateWorkOrderComment;
