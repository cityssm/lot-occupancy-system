import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotStatuses = () => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const lotStatuses = database
        .prepare("select lotStatusId, lotStatus" +
        " from LotStatuses" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotStatus")
        .all();
    database.close();
    return lotStatuses;
};
export default getLotStatuses;
