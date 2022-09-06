import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearOccupancyTypesCache } from "../functions.cache.js";
export const addOccupancyTypeField = (occupancyTypeFieldForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into OccupancyTypeFields (" +
        "occupancyTypeId, occupancyTypeField," +
        " occupancyTypeFieldValues, isRequired, pattern," +
        " minimumLength, maximumLength," +
        " orderNumber," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(occupancyTypeFieldForm.occupancyTypeId, occupancyTypeFieldForm.occupancyTypeField, occupancyTypeFieldForm.occupancyTypeFieldValues || "", occupancyTypeFieldForm.isRequired ? 1 : 0, occupancyTypeFieldForm.pattern || "", occupancyTypeFieldForm.minimumLength || 0, occupancyTypeFieldForm.maximumLength || 100, occupancyTypeFieldForm.orderNumber || -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearOccupancyTypesCache();
    return result.lastInsertRowid;
};
export default addOccupancyTypeField;
