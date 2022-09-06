import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearOccupancyTypesCache } from "../functions.cache.js";
export const updateOccupancyType = (occupancyTypeForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update OccupancyTypes" +
        " set occupancyType = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where occupancyTypeId = ?" +
        " and recordDelete_timeMillis is null")
        .run(occupancyTypeForm.occupancyType, requestSession.user.userName, rightNowMillis, occupancyTypeForm.occupancyTypeId);
    database.close();
    clearOccupancyTypesCache();
    return result.changes > 0;
};
export default updateOccupancyType;
