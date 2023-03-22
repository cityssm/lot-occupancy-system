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
        .run(milestoneForm.workOrderMilestoneCompletionDateString
        ? dateStringToInteger(milestoneForm.workOrderMilestoneCompletionDateString)
        : dateToInteger(rightNow), milestoneForm.workOrderMilestoneCompletionTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneCompletionTimeString)
        : dateToTimeInteger(rightNow), requestSession.user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.release();
    return result.changes > 0;
}
export default completeWorkOrderMilestone;
