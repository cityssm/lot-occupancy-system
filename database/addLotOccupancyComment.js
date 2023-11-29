import { dateStringToInteger, dateToInteger, dateToTimeInteger, timeStringToInteger } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export async function addLotOccupancyComment(commentForm, user) {
    const rightNow = new Date();
    let lotOccupancyCommentDate;
    let lotOccupancyCommentTime;
    if (commentForm.lotOccupancyCommentDateString) {
        lotOccupancyCommentDate = dateStringToInteger(commentForm.lotOccupancyCommentDateString);
        lotOccupancyCommentTime = timeStringToInteger(commentForm.lotOccupancyCommentTimeString ?? '');
    }
    else {
        lotOccupancyCommentDate = dateToInteger(rightNow);
        lotOccupancyCommentTime = dateToTimeInteger(rightNow);
    }
    const database = await acquireConnection();
    const result = database
        .prepare(`insert into LotOccupancyComments (
        lotOccupancyId,
        lotOccupancyCommentDate, lotOccupancyCommentTime,
        lotOccupancyComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(commentForm.lotOccupancyId, lotOccupancyCommentDate, lotOccupancyCommentTime, commentForm.lotOccupancyComment, user.userName, rightNow.getTime(), user.userName, rightNow.getTime());
    database.release();
    return result.lastInsertRowid;
}
export default addLotOccupancyComment;
