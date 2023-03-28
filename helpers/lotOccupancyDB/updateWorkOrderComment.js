import { acquireConnection } from './pool.js';
import { dateStringToInteger, timeStringToInteger } from '@cityssm/utils-datetime';
export async function updateWorkOrderComment(commentForm, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update WorkOrderComments
        set workOrderCommentDate = ?,
        workOrderCommentTime = ?,
        workOrderComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and workOrderCommentId = ?`)
        .run(dateStringToInteger(commentForm.workOrderCommentDateString), timeStringToInteger(commentForm.workOrderCommentTimeString), commentForm.workOrderComment, requestSession.user.userName, Date.now(), commentForm.workOrderCommentId);
    database.release();
    return result.changes > 0;
}
export default updateWorkOrderComment;
