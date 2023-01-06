import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { updateRecord } from "./updateRecord.js";
export function updateFeeCategory(feeCategoryForm, requestSession) {
    const success = updateRecord("FeeCategories", feeCategoryForm.feeCategoryId, feeCategoryForm.feeCategory, requestSession);
    return success;
}
export function updateFeeCategoryOrderNumber(feeCategoryId, orderNumber, connectedDatabase) {
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
}
export default updateFeeCategory;
