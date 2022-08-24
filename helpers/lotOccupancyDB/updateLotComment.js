import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const updateLotComment = (commentForm, requestSession) => {
    const rightNowMillis = Date.now();
    const database = sqlite(databasePath);
    const result = database
        .prepare("update LotComments" +
        " set lotCommentDate = ?," +
        " lotCommentTime = ?," +
        " lotComment = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where recordDelete_timeMillis is null" +
        " and lotCommentId = ?")
        .run(dateStringToInteger(commentForm.lotCommentDateString), dateStringToInteger(commentForm.lotCommentTimeString), commentForm.lotComment, requestSession.user.userName, rightNowMillis, commentForm.lotCommentId);
    database.close();
    return result.changes > 0;
};
export default updateLotComment;
