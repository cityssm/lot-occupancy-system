import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getOccupancyType = (occupancyTypeId) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const occupancyType = database
        .prepare("select occupancyTypeId, occupancyType" +
        " from OccupancyTypes" +
        " where occupancyTypeId = ?")
        .get(occupancyTypeId);
    if (occupancyType) {
        occupancyType.occupancyTypeFields = database.prepare("select * from OccupancyTypeFields" +
            " where recordDelete_timeMillis is null" +
            " and occupancyTypeId = ?" +
            " order by orderNumber, occupancyTypeField")
            .all(occupancyTypeId);
    }
    database.close();
    return occupancyType;
};
export default getOccupancyType;
