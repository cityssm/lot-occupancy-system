import { acquireConnection } from './pool.js';
import { dateStringToInteger, dateToInteger, dateToTimeInteger, timeStringToInteger } from '@cityssm/utils-datetime';
export async function completeWorkOrderMilestone(milestoneForm, requestSession) {
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
        : timeStringToInteger(milestoneForm.workOrderMilestoneCompletionTimeString), requestSession.user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.release();
    return result.changes > 0;
}
export default completeWorkOrderMilestone;
