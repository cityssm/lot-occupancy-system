import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export default async function getLotTypeFields(lotTypeId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const lotTypeFields = database
        .prepare(`select lotTypeFieldId,
        lotTypeField, fieldType, lotTypeFieldValues,
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
        database.release();
    }
    return lotTypeFields;
}
