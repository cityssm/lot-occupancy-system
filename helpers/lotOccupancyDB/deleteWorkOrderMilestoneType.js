import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
export function deleteWorkOrderMilestoneType(workOrderMilestoneTypeId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderMilestoneTypes
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where workOrderMilestoneTypeId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderMilestoneTypeId);
    database.close();
    clearWorkOrderMilestoneTypesCache();
    return result.changes > 0;
}
export default deleteWorkOrderMilestoneType;
