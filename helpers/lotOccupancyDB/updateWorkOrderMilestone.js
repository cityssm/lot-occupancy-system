import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export function updateWorkOrderMilestone(milestoneForm, requestSession) {
    const rightNow = new Date();
    const database = sqlite(databasePath);
    const result = database
        .prepare(`update WorkOrderMilestones
                set workOrderMilestoneTypeId = ?,
                workOrderMilestoneDate = ?,
                workOrderMilestoneTime = ?,
                workOrderMilestoneDescription = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where workOrderMilestoneId = ?`)
        .run(milestoneForm.workOrderMilestoneTypeId || undefined, dateStringToInteger(milestoneForm.workOrderMilestoneDateString), milestoneForm.workOrderMilestoneTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneTimeString)
        : 0, milestoneForm.workOrderMilestoneDescription, requestSession.user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.close();
    return result.changes > 0;
}
export default updateWorkOrderMilestone;
