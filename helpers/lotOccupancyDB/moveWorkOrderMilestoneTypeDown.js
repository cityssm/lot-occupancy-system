import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
export const moveWorkOrderMilestoneTypeDown = (workOrderMilestoneTypeId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber" +
        " from WorkOrderMilestoneTypes" +
        " where workOrderMilestoneTypeId = ?")
        .get(workOrderMilestoneTypeId).orderNumber;
    database
        .prepare("update WorkOrderMilestoneTypes" +
        " set orderNumber = orderNumber - 1" +
        " where recordDelete_timeMillis is null" +
        " and orderNumber = ? + 1")
        .run(currentOrderNumber);
    const result = database
        .prepare("update WorkOrderMilestoneTypes" +
        " set orderNumber = ? + 1" +
        " where workOrderMilestoneTypeId = ?")
        .run(currentOrderNumber, workOrderMilestoneTypeId);
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return result.changes > 0;
};
export const moveWorkOrderMilestoneTypeDownToBottom = (workOrderMilestoneTypeId) => {
    const database = sqlite(databasePath);
    const currentOrderNumber = database
        .prepare("select orderNumber from WorkOrderMilestoneTypes where workOrderMilestoneTypeId = ?")
        .get(workOrderMilestoneTypeId).orderNumber;
    const maxOrderNumber = database
        .prepare("select max(orderNumber) as maxOrderNumber" +
        " from WorkOrderMilestoneTypes" +
        " where recordDelete_timeMillis is null")
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update WorkOrderMilestoneTypes set orderNumber = ? + 1 where workOrderMilestoneTypeId = ?")
            .run(maxOrderNumber, workOrderMilestoneTypeId);
        database
            .prepare("update WorkOrderMilestoneTypes" +
            " set orderNumber = orderNumber - 1" +
            " where recordDelete_timeMillis is null" +
            " and orderNumber > ?")
            .run(currentOrderNumber);
    }
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return true;
};
export default moveWorkOrderMilestoneTypeDown;
