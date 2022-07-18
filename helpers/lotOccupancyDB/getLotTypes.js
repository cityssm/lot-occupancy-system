import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getLotTypes = () => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    const lotTypes = database
        .prepare("select * from LotTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, lotType")
        .all();
    database.close();
    return lotTypes;
};
export default getLotTypes;
