import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearOccupancyTypesCache } from "../functions.cache.js";
export const moveOccupancyTypeFieldDown = (occupancyTypeFieldId) => {
    const database = sqlite(databasePath);
    const currentField = database
        .prepare("select occupancyTypeId, orderNumber" +
        " from OccupancyTypeFields" +
        " where occupancyTypeFieldId = ?")
        .get(occupancyTypeFieldId);
    database
        .prepare("update OccupancyTypeFields" +
        " set orderNumber = orderNumber - 1" +
        " where recordDelete_timeMillis is null" +
        (currentField.occupancyTypeId
            ? " and occupancyTypeId = '" + currentField.occupancyTypeId + "'"
            : " and occupancyTypeId is null") +
        " and orderNumber = ? + 1")
        .run(currentField.orderNumber);
    const result = database
        .prepare("update OccupancyTypeFields" +
        " set orderNumber = ? + 1" +
        " where occupancyTypeFieldId = ?")
        .run(currentField.orderNumber, occupancyTypeFieldId);
    database.close();
    clearOccupancyTypesCache();
    return result.changes > 0;
};
export default moveOccupancyTypeFieldDown;
