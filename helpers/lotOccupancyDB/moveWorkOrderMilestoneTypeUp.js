import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId, clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
export function moveWorkOrderMilestoneTypeUp(workOrderMilestoneTypeId) {
    const currentOrderNumber = getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId(typeof workOrderMilestoneTypeId === "string"
        ? Number.parseInt(workOrderMilestoneTypeId)
        : workOrderMilestoneTypeId).orderNumber;
    if (currentOrderNumber <= 0) {
        return true;
    }
    const database = sqlite(databasePath);
    database
        .prepare(`update WorkOrderMilestoneTypes
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`)
        .run(currentOrderNumber);
    const result = database
        .prepare(`update WorkOrderMilestoneTypes
                set orderNumber = ? - 1
                where workOrderMilestoneTypeId = ?`)
        .run(currentOrderNumber, workOrderMilestoneTypeId);
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return result.changes > 0;
}
export function moveWorkOrderMilestoneTypeUpToTop(workOrderMilestoneTypeId) {
    const currentOrderNumber = getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId(typeof workOrderMilestoneTypeId === "string"
        ? Number.parseInt(workOrderMilestoneTypeId)
        : workOrderMilestoneTypeId).orderNumber;
    if (currentOrderNumber > 0) {
        const database = sqlite(databasePath);
        database
            .prepare("update WorkOrderMilestoneTypes set orderNumber = -1 where workOrderMilestoneTypeId = ?")
            .run(workOrderMilestoneTypeId);
        database
            .prepare(`update WorkOrderMilestoneTypes
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`)
            .run(currentOrderNumber);
        database.close();
        clearWorkOrderMilestoneTypesCache();
    }
    return true;
}
export default moveWorkOrderMilestoneTypeUp;
