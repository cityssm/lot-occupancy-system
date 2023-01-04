import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getLotOccupantTypeById, clearLotOccupantTypesCache } from "../functions.cache.js";
export function moveLotOccupantTypeDown(lotOccupantTypeId) {
    const currentOrderNumber = getLotOccupantTypeById(typeof lotOccupantTypeId === "string"
        ? Number.parseInt(lotOccupantTypeId)
        : lotOccupantTypeId).orderNumber;
    const database = sqlite(databasePath);
    database
        .prepare(`update LotOccupantTypes
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and orderNumber = ? + 1`)
        .run(currentOrderNumber);
    const result = database
        .prepare(`update LotOccupantTypes set orderNumber = ? + 1 where lotOccupantTypeId = ?`)
        .run(currentOrderNumber, lotOccupantTypeId);
    database.close();
    clearLotOccupantTypesCache();
    return result.changes > 0;
}
export function moveLotOccupantTypeDownToBottom(lotOccupantTypeId) {
    const currentOrderNumber = getLotOccupantTypeById(typeof lotOccupantTypeId === "string"
        ? Number.parseInt(lotOccupantTypeId)
        : lotOccupantTypeId).orderNumber;
    const database = sqlite(databasePath);
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from LotOccupantTypes
                where recordDelete_timeMillis is null`)
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update LotOccupantTypes set orderNumber = ? + 1 where lotOccupantTypeId = ?")
            .run(maxOrderNumber, lotOccupantTypeId);
        database
            .prepare(`update LotOccupantTypes
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and orderNumber > ?`)
            .run(currentOrderNumber);
    }
    database.close();
    clearLotOccupantTypesCache();
    return true;
}
export default moveLotOccupantTypeDown;
