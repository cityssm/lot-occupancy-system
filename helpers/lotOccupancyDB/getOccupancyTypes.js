import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getOccupancyTypes = () => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const occupancyTypes = database
        .prepare("select * from OccupancyTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, occupancyType")
        .all();
    database.close();
    return occupancyTypes;
};
export default getOccupancyTypes;
