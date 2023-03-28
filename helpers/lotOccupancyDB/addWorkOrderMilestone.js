import { acquireConnection } from './pool.js';
import { dateStringToInteger, timeStringToInteger } from '@cityssm/utils-datetime';
export async function addWorkOrderMilestone(milestoneForm, requestSession) {
    const rightNowMillis = Date.now();
    const database = await acquireConnection();
    const result = database
        .prepare(`insert into WorkOrderMilestones (
        workOrderId, workOrderMilestoneTypeId,
        workOrderMilestoneDate, workOrderMilestoneTime,
        workOrderMilestoneDescription,
        workOrderMilestoneCompletionDate, workOrderMilestoneCompletionTime,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(milestoneForm.workOrderId, milestoneForm.workOrderMilestoneTypeId === ''
        ? undefined
        : milestoneForm.workOrderMilestoneTypeId, milestoneForm.workOrderMilestoneDateString === ''
        ? 0
        : dateStringToInteger(milestoneForm.workOrderMilestoneDateString), (milestoneForm.workOrderMilestoneTimeString ?? '') === ''
        ? 0
        : timeStringToInteger(milestoneForm.workOrderMilestoneTimeString), milestoneForm.workOrderMilestoneDescription, (milestoneForm.workOrderMilestoneCompletionDateString ?? '') === ''
        ? undefined
        : dateStringToInteger(milestoneForm.workOrderMilestoneCompletionDateString), (milestoneForm.workOrderMilestoneCompletionTimeString ?? '') === ''
        ? undefined
        : timeStringToInteger(milestoneForm.workOrderMilestoneCompletionTimeString), requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.release();
    return result.lastInsertRowid;
}
export default addWorkOrderMilestone;
