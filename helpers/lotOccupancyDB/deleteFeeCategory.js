import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const deleteFeeCategory = (feeCategoryId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update FeeCategories" +
        " set recordDelete_userName = ?," +
        " recordDelete_timeMillis = ?" +
        " where feeCategoryId = ?")
        .run(requestSession.user.userName, rightNowMillis, feeCategoryId);
    database.close();
    return result.changes > 0;
};
export default deleteFeeCategory;
