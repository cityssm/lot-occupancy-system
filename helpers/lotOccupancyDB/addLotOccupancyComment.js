import { dateStringToInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addLotOccupancyComment = (commentForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into LotOccupancyComments (" +
        "lotOccupancyId, lotOccupancyCommentDate, lotOccupancyCommentTime, lotOccupancyComment," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(commentForm.lotOccupancyId, dateStringToInteger(commentForm.lotOccupancyCommentDateString), timeStringToInteger(commentForm.lotOccupancyCommentTimeString), commentForm.lotOccupancyComment, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.lastInsertRowid;
};
export default addLotOccupancyComment;
