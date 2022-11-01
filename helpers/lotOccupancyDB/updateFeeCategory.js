import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const updateFeeCategory = (feeCategoryForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update FeeCategories" +
        " set feeCategory = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where recordDelete_timeMillis is null" +
        " and feeCategoryId = ?")
        .run(feeCategoryForm.feeCategory, requestSession.user.userName, rightNowMillis, feeCategoryForm.feeCategoryId);
    database.close();
    return result.changes > 0;
};
export const updateFeeCategoryOrderNumber = (feeCategoryId, orderNumber, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    const result = database
        .prepare("update FeeCategories set orderNumber = ? where feeCategoryId = ?")
        .run(orderNumber, feeCategoryId);
    if (!connectedDatabase) {
        database.close();
    }
    return result.changes > 0;
};
export default updateFeeCategory;
