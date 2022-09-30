import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export const moveLotTypeUp = (lotTypeId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber" +
        " from LotTypes" +
        " where lotTypeId = ?")
        .get(lotTypeId).orderNumber;
    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }
    database
        .prepare("update LotTypes" +
        " set orderNumber = orderNumber + 1" +
        " where recordDelete_timeMillis is null" +
        " and orderNumber = ? - 1")
        .run(currentOrderNumber);
    const result = database
        .prepare("update LotTypes" +
        " set orderNumber = ? - 1" +
        " where lotTypeId = ?")
        .run(currentOrderNumber, lotTypeId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
};
export default moveLotTypeUp;
