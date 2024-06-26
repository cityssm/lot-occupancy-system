import getOccupancyTypeFields from './getOccupancyTypeFields.js';
import getOccupancyTypePrints from './getOccupancyTypePrints.js';
import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export default async function getOccupancyTypes() {
    const database = await acquireConnection();
    const occupancyTypes = database
        .prepare(`select occupancyTypeId, occupancyType, orderNumber
        from OccupancyTypes
        where recordDelete_timeMillis is null
        order by orderNumber, occupancyType`)
        .all();
    let expectedTypeOrderNumber = -1;
    for (const occupancyType of occupancyTypes) {
        expectedTypeOrderNumber += 1;
        if (occupancyType.orderNumber !== expectedTypeOrderNumber) {
            updateRecordOrderNumber('OccupancyTypes', occupancyType.occupancyTypeId, expectedTypeOrderNumber, database);
            occupancyType.orderNumber = expectedTypeOrderNumber;
        }
        occupancyType.occupancyTypeFields = await getOccupancyTypeFields(occupancyType.occupancyTypeId, database);
        occupancyType.occupancyTypePrints = await getOccupancyTypePrints(occupancyType.occupancyTypeId, database);
    }
    database.release();
    return occupancyTypes;
}
