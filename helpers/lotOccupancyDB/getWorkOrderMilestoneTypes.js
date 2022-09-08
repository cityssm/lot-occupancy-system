import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getWorkOrderMilestoneTypes = () => {
    const database = sqlite(databasePath);
    const workOrderMilestoneTypes = database
        .prepare("select workOrderMilestoneTypeId, workOrderMilestoneType, orderNumber" +
        " from WorkOrderMilestoneTypes" +
        " where recordDelete_timeMillis is null" +
        " order by orderNumber, workOrderMilestoneType")
        .all();
    let expectedOrderNumber = 0;
    for (const workOrderMilestoneType of workOrderMilestoneTypes) {
        if (workOrderMilestoneType.orderNumber !== expectedOrderNumber) {
            database
                .prepare("update WorkOrdeMilestoneTypes" +
                " set orderNumber = ?" +
                " where workOrderMilestoneTypeId = ?")
                .run(expectedOrderNumber, workOrderMilestoneType.workOrderMilestoneTypeId);
            workOrderMilestoneType.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    database.close();
    return workOrderMilestoneTypes;
};
export default getWorkOrderMilestoneTypes;
