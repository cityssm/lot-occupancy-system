import { acquireConnection } from './pool.js';
import { dateStringToInteger, timeStringToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js';
export async function updateWorkOrderMilestone(milestoneForm, requestSession) {
    const rightNow = new Date();
    const database = await acquireConnection();
    const result = database
        .prepare(`update WorkOrderMilestones
        set workOrderMilestoneTypeId = ?,
        workOrderMilestoneDate = ?,
        workOrderMilestoneTime = ?,
        workOrderMilestoneDescription = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?`)
        .run(milestoneForm.workOrderMilestoneTypeId === ''
        ? undefined
        : milestoneForm.workOrderMilestoneTypeId, dateStringToInteger(milestoneForm.workOrderMilestoneDateString), milestoneForm.workOrderMilestoneTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneTimeString)
        : 0, milestoneForm.workOrderMilestoneDescription, requestSession.user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.release();
    return result.changes > 0;
}
export default updateWorkOrderMilestone;
