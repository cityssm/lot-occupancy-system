import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const moveFeeCategoryDown = (feeCategoryId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber" +
        " from FeeCategories" +
        " where feeCategoryId = ?")
        .get(feeCategoryId).orderNumber;
    database
        .prepare("update FeeCategories" +
        " set orderNumber = orderNumber - 1" +
        " where recordDelete_timeMillis is null" +
        " and orderNumber = ? + 1")
        .run(currentOrderNumber);
    const result = database
        .prepare("update FeeCategories" +
        " set orderNumber = ? + 1" +
        " where feeCategoryId = ?")
        .run(currentOrderNumber, feeCategoryId);
    database.close();
    return result.changes > 0;
};
export default moveFeeCategoryDown;
