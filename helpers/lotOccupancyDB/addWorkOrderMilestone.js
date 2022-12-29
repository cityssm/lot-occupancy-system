import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateStringToInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export function addWorkOrderMilestone(milestoneForm, requestSession) {
    const rightNow = new Date();
    const database = sqlite(databasePath);
    const result = database
        .prepare(`insert into WorkOrderMilestones (
                workOrderId, workOrderMilestoneTypeId,
                workOrderMilestoneDate, workOrderMilestoneTime,
                workOrderMilestoneDescription,
                workOrderMilestoneCompletionDate, workOrderMilestoneCompletionTime,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(milestoneForm.workOrderId, milestoneForm.workOrderMilestoneTypeId || undefined, dateStringToInteger(milestoneForm.workOrderMilestoneDateString), milestoneForm.workOrderMilestoneTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneTimeString)
        : 0, milestoneForm.workOrderMilestoneDescription, milestoneForm.workOrderMilestoneCompletionDateString
        ? dateStringToInteger(milestoneForm.workOrderMilestoneCompletionDateString)
        : undefined, milestoneForm.workOrderMilestoneCompletionTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneCompletionTimeString)
        : undefined, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    database.close();
    return result.lastInsertRowid;
}
export default addWorkOrderMilestone;
