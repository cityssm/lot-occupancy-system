import { acquireConnection } from './pool.js';
import { dateStringToInteger, timeStringToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js';
export async function updateLotComment(commentForm, requestSession) {
    const rightNowMillis = Date.now();
    const database = await acquireConnection();
    const result = database
        .prepare(`update LotComments
        set lotCommentDate = ?,
        lotCommentTime = ?,
        lotComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotCommentId = ?`)
        .run(dateStringToInteger(commentForm.lotCommentDateString), timeStringToInteger(commentForm.lotCommentTimeString), commentForm.lotComment, requestSession.user.userName, rightNowMillis, commentForm.lotCommentId);
    database.release();
    return result.changes > 0;
}
export default updateLotComment;
