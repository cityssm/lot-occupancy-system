import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearCacheByTableName } from "../functions.cache.js";
import { updateRecordOrderNumber } from "./updateRecordOrderNumber.js";
function getCurrentField(lotTypeFieldId, connectedDatabase) {
    const currentField = connectedDatabase
        .prepare("select lotTypeId, orderNumber from LotTypeFields where lotTypeFieldId = ?")
        .get(lotTypeFieldId);
    return currentField;
}
export function moveLotTypeFieldDown(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(lotTypeFieldId, database);
    database
        .prepare(`update LotTypeFields
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and lotTypeId = ? and orderNumber = ? + 1`)
        .run(currentField.lotTypeId, currentField.orderNumber);
    const success = updateRecordOrderNumber("LotTypeFields", lotTypeFieldId, currentField.orderNumber + 1, database);
    database.close();
    clearCacheByTableName("LotTypeFields");
    return success;
}
export function moveLotTypeFieldDownToBottom(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(lotTypeFieldId, database);
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from LotTypeFields
                where recordDelete_timeMillis is null
                and lotTypeId = ?`)
        .get(currentField.lotTypeId).maxOrderNumber;
    if (currentField.orderNumber !== maxOrderNumber) {
        updateRecordOrderNumber("LotTypeFields", lotTypeFieldId, maxOrderNumber + 1, database);
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
export function moveLotTypeFieldUp(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(lotTypeFieldId, database);
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
    const success = updateRecordOrderNumber("LotTypeFields", lotTypeFieldId, currentField.orderNumber - 1, database);
    database.close();
    clearCacheByTableName("LotTypeFields");
    return success;
}
export function moveLotTypeFieldUpToTop(lotTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(lotTypeFieldId, database);
    if (currentField.orderNumber > 0) {
        updateRecordOrderNumber("LotTypeFields", lotTypeFieldId, -1, database);
        database
            .prepare(`update LotTypeFields
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and lotTypeId = ?
                    and orderNumber < ?`)
            .run(currentField.lotTypeId, currentField.orderNumber);
    }
    database.close();
    clearCacheByTableName("LotTypeFields");
    return true;
}
