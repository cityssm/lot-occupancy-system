import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export default async function getOccupancyTypeFields(occupancyTypeId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const sqlParameters = [];
    if ((occupancyTypeId ?? -1) !== -1) {
        sqlParameters.push(occupancyTypeId);
    }
    const occupancyTypeFields = database
        .prepare(`select occupancyTypeFieldId, occupancyTypeField, fieldType,
        occupancyTypeFieldValues, isRequired, pattern, minimumLength, maximumLength, orderNumber
        from OccupancyTypeFields
        where recordDelete_timeMillis is null
        ${(occupancyTypeId ?? -1) === -1
        ? ' and occupancyTypeId is null'
        : ' and occupancyTypeId = ?'}
        order by orderNumber, occupancyTypeField`)
        .all(sqlParameters);
    let expectedOrderNumber = 0;
    for (const occupancyTypeField of occupancyTypeFields) {
        if (occupancyTypeField.orderNumber !== expectedOrderNumber) {
            updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeField.occupancyTypeFieldId, expectedOrderNumber, database);
            occupancyTypeField.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return occupancyTypeFields;
}
