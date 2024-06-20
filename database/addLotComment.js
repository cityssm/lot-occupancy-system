import * as dateTimeFunctions from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export default async function addLotComment(lotCommentForm, user) {
    const database = await acquireConnection();
    const rightNow = new Date();
    const result = database
        .prepare(`insert into LotComments (
        lotId,
        lotCommentDate, lotCommentTime, lotComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis) 
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotCommentForm.lotId, dateTimeFunctions.dateToInteger(rightNow), dateTimeFunctions.dateToTimeInteger(rightNow), lotCommentForm.lotComment, user.userName, rightNow.getTime(), user.userName, rightNow.getTime());
    database.release();
    return result.lastInsertRowid;
}
