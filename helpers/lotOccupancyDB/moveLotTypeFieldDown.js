import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearCacheByTableName } from "../functions.cache.js";
export function moveLotTypeFieldDown(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);
    database
        .prepare(`update LotTypeFields
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and lotTypeId = ? and orderNumber = ? + 1`)
        .run(currentField.lotTypeId, currentField.orderNumber);
    const result = database
        .prepare("update LotTypeFields set orderNumber = ? + 1 where lotTypeFieldId = ?")
        .run(currentField.orderNumber, lotTypeFieldId);
    database.close();
    clearCacheByTableName("LotTypeFields");
    return result.changes > 0;
}
export function moveLotTypeFieldDownToBottom(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = database
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from LotTypeFields
                where recordDelete_timeMillis is null
                and lotTypeId = ?`)
        .get(currentField.lotTypeId).maxOrderNumber;
    if (currentField.orderNumber !== maxOrderNumber) {
        database
            .prepare("update LotTypeFields set orderNumber = ? + 1 where lotTypeFieldId = ?")
            .run(maxOrderNumber, lotTypeFieldId);
        database
            .prepare(`update LotTypeFields
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and lotTypeId = ?
                    and orderNumber > ?`)
            .run(currentField.lotTypeId, currentField.orderNumber);
    }
    database.close();
    clearCacheByTableName("LotTypeFields");
    return true;
}
export default moveLotTypeFieldDown;
