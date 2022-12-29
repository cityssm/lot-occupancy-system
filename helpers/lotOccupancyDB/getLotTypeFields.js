import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function getLotTypeFields(lotTypeId, connectedDatabase) {
    const database = connectedDatabase || sqlite(databasePath);
    const lotTypeFields = database
        .prepare(`select lotTypeFieldId,
                lotTypeField, lotTypeFieldValues,
                isRequired, pattern, minimumLength, maximumLength, orderNumber
                from LotTypeFields
                where recordDelete_timeMillis is null
                and lotTypeId = ?
                order by orderNumber, lotTypeField`)
        .all(lotTypeId);
    let expectedFieldOrderNumber = -1;
    for (const lotTypeField of lotTypeFields) {
        expectedFieldOrderNumber += 1;
        if (lotTypeField.orderNumber !== expectedFieldOrderNumber) {
            database
                .prepare("update LotTypeFields set orderNumber = ? where lotTypeFieldId = ?")
                .run(expectedFieldOrderNumber, lotTypeField.lotTypeFieldId);
            lotTypeField.orderNumber = expectedFieldOrderNumber;
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return lotTypeFields;
}
export default getLotTypeFields;
