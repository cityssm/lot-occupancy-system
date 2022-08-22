import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const updateLotOccupancyComment = (commentForm, requestSession) => {
    const rightNowMillis = Date.now();
    const database = sqlite(databasePath);
    const result = database
        .prepare("update LotOccupancyComments" +
        " set lotOccupancyCommentDate = ?," +
        " lotOccupancyCommentTime = ?," +
        " lotOccupancyComment = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where recordDelete_timeMillis is null" +
        " and lotOccupancyCommentId = ?")
        .run(dateStringToInteger(commentForm.lotOccupancyCommentDateString), dateStringToInteger(commentForm.lotOccupancyCommentTimeString), commentForm.lotOccupancyComment, requestSession.user.userName, rightNowMillis, commentForm.lotOccupancyCommentId);
    database.close();
    return result.changes > 0;
};
export default updateLotOccupancyComment;