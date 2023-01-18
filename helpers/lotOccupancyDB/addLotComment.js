import { acquireConnection } from './pool.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
export async function addLotComment(lotCommentForm, requestSession) {
    const database = await acquireConnection();
    const rightNow = new Date();
    const result = database
        .prepare(`insert into LotComments (
        lotId,
        lotCommentDate, lotCommentTime, lotComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis) 
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotCommentForm.lotId, dateTimeFunctions.dateToInteger(rightNow), dateTimeFunctions.dateToTimeInteger(rightNow), lotCommentForm.lotComment, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    database.release();
    return result.lastInsertRowid;
}
export default addLotComment;
