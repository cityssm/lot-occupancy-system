import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function deleteWorkOrderMilestone(workOrderMilestoneId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderMilestones
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where workOrderMilestoneId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderMilestoneId);
    database.close();
    return result.changes > 0;
}
export default deleteWorkOrderMilestone;
