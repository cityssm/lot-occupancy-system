import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export function getLotTypeFields(lotTypeId, connectedDatabase) {
    const database = connectedDatabase ?? sqlite(databasePath);
    const lotTypeFields = database
        .prepare(`select lotTypeFieldId,
        lotTypeField, lotTypeFieldValues,
        isRequired, pattern, minimumLength, maximumLength, orderNumber
        from LotTypeFields
        where recordDelete_timeMillis is null
        and lotTypeId = ?
        order by orderNumber, lotTypeField`)
        .all(lotTypeId);
    let expectedOrderNumber = 0;
    for (const lotTypeField of lotTypeFields) {
        if (lotTypeField.orderNumber !== expectedOrderNumber) {
            updateRecordOrderNumber('LotTypeFields', lotTypeField.lotTypeFieldId, expectedOrderNumber, database);
            lotTypeField.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    if (connectedDatabase === undefined) {
        database.close();
    }
    return lotTypeFields;
}
export default getLotTypeFields;
