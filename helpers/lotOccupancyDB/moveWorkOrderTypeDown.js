import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderTypesCache } from "../functions.cache.js";
export function moveWorkOrderTypeDown(workOrderTypeId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from WorkOrderTypes where workOrderTypeId = ?")
        .get(workOrderTypeId).orderNumber;
    database
        .prepare(`update WorkOrderTypes
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and orderNumber = ? + 1`)
        .run(currentOrderNumber);
    const result = database
        .prepare("update WorkOrderTypes set orderNumber = ? + 1 where workOrderTypeId = ?")
        .run(currentOrderNumber, workOrderTypeId);
    database.close();
    clearWorkOrderTypesCache();
    return result.changes > 0;
}
export function moveWorkOrderTypeDownToBottom(workOrderTypeId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from WorkOrderTypes where workOrderTypeId = ?")
        .get(workOrderTypeId).orderNumber;
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
                from WorkOrderTypes
                where recordDelete_timeMillis is null`)
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update WorkOrderTypes set orderNumber = ? + 1 where workOrderTypeId = ?")
            .run(maxOrderNumber, workOrderTypeId);
        database
            .prepare(`update WorkOrderTypes
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and orderNumber > ?`)
            .run(currentOrderNumber);
    }
    database.close();
    clearWorkOrderTypesCache();
    return true;
}
export default moveWorkOrderTypeDown;
