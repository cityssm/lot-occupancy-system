import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export function getWorkOrderMilestoneTypes() {
    const database = sqlite(databasePath);
    const workOrderMilestoneTypes = database
        .prepare(`select workOrderMilestoneTypeId, workOrderMilestoneType, orderNumber
        from WorkOrderMilestoneTypes
        where recordDelete_timeMillis is null
        order by orderNumber, workOrderMilestoneType`)
        .all();
    let expectedOrderNumber = 0;
    for (const workOrderMilestoneType of workOrderMilestoneTypes) {
        if (workOrderMilestoneType.orderNumber !== expectedOrderNumber) {
            updateRecordOrderNumber('WorkOrderMilestoneTypes', workOrderMilestoneType.workOrderMilestoneTypeId, expectedOrderNumber, database);
            workOrderMilestoneType.orderNumber = expectedOrderNumber;
        }
        expectedOrderNumber += 1;
    }
    database.close();
    return workOrderMilestoneTypes;
}
export default getWorkOrderMilestoneTypes;
