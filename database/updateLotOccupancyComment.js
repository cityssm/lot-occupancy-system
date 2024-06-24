import { dateStringToInteger, timeStringToInteger } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export default async function updateLotOccupancyComment(commentForm, user) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update LotOccupancyComments
        set lotOccupancyCommentDate = ?,
        lotOccupancyCommentTime = ?,
        lotOccupancyComment = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyCommentId = ?`)
        .run(dateStringToInteger(commentForm.lotOccupancyCommentDateString), timeStringToInteger(commentForm.lotOccupancyCommentTimeString), commentForm.lotOccupancyComment, user.userName, Date.now(), commentForm.lotOccupancyCommentId);
    database.release();
    return result.changes > 0;
}
