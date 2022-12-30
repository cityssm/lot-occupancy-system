import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearOccupancyTypesCache } from "../functions.cache.js";
export function moveOccupancyTypeDown(occupancyTypeId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from OccupancyTypes where occupancyTypeId = ?")
        .get(occupancyTypeId).orderNumber;
    database
        .prepare(`update OccupancyTypes
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and orderNumber = ? + 1`)
        .run(currentOrderNumber);
    const result = database
        .prepare("update OccupancyTypes set orderNumber = ? + 1 where occupancyTypeId = ?")
        .run(currentOrderNumber, occupancyTypeId);
    database.close();
    clearOccupancyTypesCache();
    return result.changes > 0;
}
export function moveOccupancyTypeDownToBottom(occupancyTypeId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from OccupancyTypes where occupancyTypeId = ?")
        .get(occupancyTypeId).orderNumber;
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from OccupancyTypes
                where recordDelete_timeMillis is null`)
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update OccupancyTypes set orderNumber = ? + 1 where occupancyTypeId = ?")
            .run(maxOrderNumber, occupancyTypeId);
        database
            .prepare(`update OccupancyTypes
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and orderNumber > ?`)
            .run(currentOrderNumber);
    }
    database.close();
    clearOccupancyTypesCache();
    return true;
}
export default moveOccupancyTypeDown;
