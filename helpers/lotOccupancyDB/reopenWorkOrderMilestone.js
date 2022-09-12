import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const reopenWorkOrderMilestone = (workOrderMilestoneId, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("update WorkOrderMilestones" +
        " set workOrderMilestoneCompletionDate = null," +
        " workOrderMilestoneCompletionTime = null," +
        " recordUpdate_userName = ?," +
        " recordUpdate_timeMillis = ?" +
        " where workOrderMilestoneId = ?" +
        " and workOrderMilestoneCompletionDate is not null")
        .run(requestSession.user.userName, rightNowMillis, workOrderMilestoneId);
    database.close();
    return result.changes > 0;
};
export default reopenWorkOrderMilestone;
