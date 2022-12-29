import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function getLotOccupantTypes() {
    const database = sqlite(databasePath);
    const lotOccupantTypes = database
        .prepare(`select lotOccupantTypeId, lotOccupantType, fontAwesomeIconClass
                from LotOccupantTypes
                where recordDelete_timeMillis is null
                order by orderNumber, lotOccupantType`)
        .all();
    let expectedOrderNumber = 0;
    for (const lotOccupantType of lotOccupantTypes) {
        if (lotOccupantType.orderNumber !== expectedOrderNumber) {
            database
                .prepare(`update LotOccupantTypes
                        set orderNumber = ?
                        where lotOccupantTypeId = ?`)
                .run(expectedOrderNumber, lotOccupantType.lotOccupantTypeId);
            lotOccupantType.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    database.close();
    return lotOccupantTypes;
}
export default getLotOccupantTypes;
