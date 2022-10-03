import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const moveFeeCategoryDown = (feeCategoryId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from FeeCategories where feeCategoryId = ?")
        .get(feeCategoryId).orderNumber;
    database
        .prepare("update FeeCategories" +
        " set orderNumber = orderNumber - 1" +
        " where recordDelete_timeMillis is null" +
        " and orderNumber = ? + 1")
        .run(currentOrderNumber);
    const result = database
        .prepare("update FeeCategories set orderNumber = ? + 1 where feeCategoryId = ?")
        .run(currentOrderNumber, feeCategoryId);
    database.close();
    return result.changes > 0;
};
export const moveFeeCategoryDownToBottom = (feeCategoryId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from FeeCategories where feeCategoryId = ?")
        .get(feeCategoryId).orderNumber;
    const maxOrderNumber = database
        .prepare("select max(orderNumber) as maxOrderNumber" +
        " from FeeCategories" +
        " where recordDelete_timeMillis is null")
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update FeeCategories set orderNumber = ? + 1 where feeCategoryId = ?")
            .run(maxOrderNumber, feeCategoryId);
        database
            .prepare("update FeeCategories" +
            " set orderNumber = orderNumber - 1" +
            " where recordDelete_timeMillis is null" +
            " and orderNumber > ?")
            .run(currentOrderNumber);
    }
    database.close();
    return true;
};
export default moveFeeCategoryDown;
