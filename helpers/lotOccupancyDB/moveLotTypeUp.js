import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getLotTypeById, clearLotTypesCache } from "../functions.cache.js";
export function moveLotTypeUp(lotTypeId) {
    const currentOrderNumber = getLotTypeById(typeof lotTypeId === "string" ? Number.parseInt(lotTypeId) : lotTypeId).orderNumber;
    if (currentOrderNumber <= 0) {
        return true;
    }
    const database = sqlite(databasePath);
    database
        .prepare(`update LotTypes
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`)
        .run(currentOrderNumber);
    const result = database
        .prepare("update LotTypes set orderNumber = ? - 1 where lotTypeId = ?")
        .run(currentOrderNumber, lotTypeId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
}
export function moveLotTypeUpToTop(lotTypeId) {
    const currentOrderNumber = getLotTypeById(typeof lotTypeId === "string" ? Number.parseInt(lotTypeId) : lotTypeId).orderNumber;
    if (currentOrderNumber > 0) {
        const database = sqlite(databasePath);
        database.prepare("update LotTypes set orderNumber = -1 where lotTypeId = ?").run(lotTypeId);
        database
            .prepare(`update LotTypes
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`)
            .run(currentOrderNumber);
        database.close();
        clearLotTypesCache();
    }
    return true;
}
export default moveLotTypeUp;
