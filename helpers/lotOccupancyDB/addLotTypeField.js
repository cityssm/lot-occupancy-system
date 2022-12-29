import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export function addLotTypeField(lotTypeFieldForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into LotTypeFields (
                lotTypeId, lotTypeField, lotTypeFieldValues,
                isRequired, pattern,
                minimumLength, maximumLength,
                orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotTypeFieldForm.lotTypeId, lotTypeFieldForm.lotTypeField, lotTypeFieldForm.lotTypeFieldValues || "", lotTypeFieldForm.isRequired ? 1 : 0, lotTypeFieldForm.pattern || "", lotTypeFieldForm.minimumLength || 0, lotTypeFieldForm.maximumLength || 100, lotTypeFieldForm.orderNumber || -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearLotTypesCache();
    return result.lastInsertRowid;
}
export default addLotTypeField;
