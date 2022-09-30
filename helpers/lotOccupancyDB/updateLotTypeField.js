import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearLotTypesCache } from "../functions.cache.js";
export const updateLotTypeField = (lotTypeFieldForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update LotTypeFields" +
        " set lotTypeField = ?," +
        " isRequired = ?," +
        " minimumLength = ?," +
        " maximumLength = ?," +
        " pattern = ?," +
        " lotTypeFieldValues = ?," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where lotTypeFieldId = ?" +
        " and recordDelete_timeMillis is null")
        .run(lotTypeFieldForm.lotTypeField, Number.parseInt(lotTypeFieldForm.isRequired, 10), lotTypeFieldForm.minimumLength || 0, lotTypeFieldForm.maximumLength || 100, lotTypeFieldForm.pattern || "", lotTypeFieldForm.lotTypeFieldValues, requestSession.user.userName, rightNowMillis, lotTypeFieldForm.lotTypeFieldId);
    database.close();
    clearLotTypesCache();
    return result.changes > 0;
};
export default updateLotTypeField;
