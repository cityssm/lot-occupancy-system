import { dateStringToInteger, dateToInteger, dateToTimeInteger, timeStringToInteger } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export async function completeWorkOrderMilestone(milestoneForm, user) {
    const rightNow = new Date();
    const database = await acquireConnection();
    const result = database
        .prepare(`update WorkOrderMilestones
        set workOrderMilestoneCompletionDate = ?,
        workOrderMilestoneCompletionTime = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?`)
        .run((milestoneForm.workOrderMilestoneCompletionDateString ?? '') === ''
        ? dateToInteger(rightNow)
        : dateStringToInteger(milestoneForm.workOrderMilestoneCompletionDateString), (milestoneForm.workOrderMilestoneCompletionTimeString ?? '') === ''
        ? dateToTimeInteger(rightNow)
        : timeStringToInteger(milestoneForm.workOrderMilestoneCompletionTimeString), user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.release();
    return result.changes > 0;
}
export default completeWorkOrderMilestone;
