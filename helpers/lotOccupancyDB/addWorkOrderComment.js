import * as dateTimeFunctions from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export async function addWorkOrderComment(workOrderCommentForm, user) {
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
        .run(workOrderCommentForm.workOrderId, dateTimeFunctions.dateToInteger(rightNow), dateTimeFunctions.dateToTimeInteger(rightNow), workOrderCommentForm.workOrderComment, user.userName, rightNow.getTime(), user.userName, rightNow.getTime());
    database.release();
    return result.lastInsertRowid;
}
export default addWorkOrderComment;
