import { acquireConnection } from './pool.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
export async function addWorkOrderComment(workOrderCommentForm, requestSession) {
    const database = await acquireConnection();
    const rightNow = new Date();
    const result = database
        .prepare(`insert into WorkOrderComments (
        workOrderId,
        workOrderCommentDate, workOrderCommentTime,
        workOrderComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(workOrderCommentForm.workOrderId, dateTimeFunctions.dateToInteger(rightNow), dateTimeFunctions.dateToTimeInteger(rightNow), workOrderCommentForm.workOrderComment, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    database.release();
    return result.lastInsertRowid;
}
export default addWorkOrderComment;
