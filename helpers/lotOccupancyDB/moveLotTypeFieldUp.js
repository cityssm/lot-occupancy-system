import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export function moveLotTypeFieldUp(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);
    if (currentField.orderNumber <= 0) {
        database.close();
        return true;
    }
    database
        .prepare(`update LotTypeFields
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and lotTypeId = ?
                and orderNumber = ? - 1`)
        .run(currentField.lotTypeId, currentField.orderNumber);
    const result = database
        .prepare("update LotTypeFields set orderNumber = ? - 1 where lotTypeFieldId = ?")
        .run(currentField.orderNumber, lotTypeFieldId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
}
export function moveLotTypeFieldUpToTop(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);
    if (currentField.orderNumber > 0) {
        database
            .prepare("update LotTypeFields set orderNumber = -1 where lotTypeFieldId = ?")
            .run(lotTypeFieldId);
        database
            .prepare(`update LotTypeFields
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and lotTypeId = ?
                    and orderNumber < ?`)
            .run(currentField.lotTypeId, currentField.orderNumber);
    }
    database.close();
    clearLotTypesCache();
    return true;
}
export default moveLotTypeFieldUp;
