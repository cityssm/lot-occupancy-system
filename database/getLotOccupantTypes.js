import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export default async function getLotOccupantTypes() {
    const database = await acquireConnection();
    const lotOccupantTypes = database
        .prepare(`select lotOccupantTypeId, lotOccupantType, fontAwesomeIconClass, occupantCommentTitle,
        orderNumber
        from LotOccupantTypes
        where recordDelete_timeMillis is null
        order by orderNumber, lotOccupantType`)
        .all();
    let expectedOrderNumber = 0;
    for (const lotOccupantType of lotOccupantTypes) {
        if (lotOccupantType.orderNumber !== expectedOrderNumber) {
            updateRecordOrderNumber('LotOccupantTypes', lotOccupantType.lotOccupantTypeId, expectedOrderNumber, database);
            lotOccupantType.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    database.release();
    return lotOccupantTypes;
}
