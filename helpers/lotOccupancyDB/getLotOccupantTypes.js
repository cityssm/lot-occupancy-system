import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotOccupantTypes = () => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const lotOccupantTypes = database
        .prepare("select lotOccupantTypeId, lotOccupantType" +
        " from LotOccupantTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotOccupantType")
        .all();
    database.close();
    return lotOccupantTypes;
};
export default getLotOccupantTypes;
