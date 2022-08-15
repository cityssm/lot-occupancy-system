import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteLotOccupancyComment = (lotOccupancyCommentId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotOccupancyComments" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where lotOccupancyCommentId = ?")
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyCommentId);
    database.close();
    return (result.changes > 0);
};
export default deleteLotOccupancyComment;
