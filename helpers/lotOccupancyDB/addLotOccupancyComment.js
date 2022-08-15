import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger, dateToInteger, dateToTimeInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const addLotOccupancyComment = (commentForm, requestSession) => {
    const rightNow = new Date();
    let lotOccupancyCommentDate;
    let lotOccupancyCommentTime;
    if (commentForm.lotOccupancyCommentDateString) {
        lotOccupancyCommentDate = dateStringToInteger(commentForm.lotOccupancyCommentDateString);
        lotOccupancyCommentTime = timeStringToInteger(commentForm.lotOccupancyCommentTimeString);
    }
    else {
        lotOccupancyCommentDate = dateToInteger(rightNow);
        lotOccupancyCommentTime = dateToTimeInteger(rightNow);
    }
    const database = sqlite(databasePath);
    const result = database
        .prepare("insert into LotOccupancyComments (" +
        "lotOccupancyId, lotOccupancyCommentDate, lotOccupancyCommentTime, lotOccupancyComment," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(commentForm.lotOccupancyId, lotOccupancyCommentDate, lotOccupancyCommentTime, commentForm.lotOccupancyComment, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    database.close();
    return result.lastInsertRowid;
};
export default addLotOccupancyComment;
