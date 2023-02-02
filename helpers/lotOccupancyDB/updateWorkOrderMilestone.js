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
        : milestoneForm.workOrderMilestoneTypeId, milestoneForm.workOrderMilestoneDateString === ''
        ? 0
        : dateStringToInteger(milestoneForm.workOrderMilestoneDateString), (milestoneForm.workOrderMilestoneTimeString ?? '') === ''
        ? 0
        : timeStringToInteger(milestoneForm.workOrderMilestoneTimeString), milestoneForm.workOrderMilestoneDescription, requestSession.user.userName, rightNow.getTime(), milestoneForm.workOrderMilestoneId);
    database.release();
    return result.changes > 0;
}
export default updateWorkOrderMilestone;
