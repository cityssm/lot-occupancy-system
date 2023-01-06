import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { updateRecordOrderNumber } from "./updateRecordOrderNumber.js";
export function getLotOccupantTypes() {
    const database = sqlite(databasePath);
    const lotOccupantTypes = database
        .prepare(`select lotOccupantTypeId, lotOccupantType, fontAwesomeIconClass, orderNumber
                from LotOccupantTypes
                where recordDelete_timeMillis is null
                order by orderNumber, lotOccupantType`)
        .all();
    let expectedOrderNumber = 0;
    for (const lotOccupantType of lotOccupantTypes) {
        if (lotOccupantType.orderNumber !== expectedOrderNumber) {
            updateRecordOrderNumber("LotOccupantTypes", lotOccupantType.lotOccupantTypeId, expectedOrderNumber, database);
            lotOccupantType.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    database.close();
    return lotOccupantTypes;
}
export default getLotOccupantTypes;
