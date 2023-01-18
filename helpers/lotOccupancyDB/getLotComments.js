import { acquireConnection } from './pool.js';
import { dateIntegerToString, timeIntegerToString } from '@cityssm/expressjs-server-js/dateTimeFns.js';
export async function getLotComments(lotId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    database.function('userFn_dateIntegerToString', dateIntegerToString);
    database.function('userFn_timeIntegerToString', timeIntegerToString);
    const lotComments = database
        .prepare(`select lotCommentId,
        lotCommentDate, userFn_dateIntegerToString(lotCommentDate) as lotCommentDateString,
        lotCommentTime, userFn_timeIntegerToString(lotCommentTime) as lotCommentTimeString,
        lotComment,
        recordCreate_userName, recordUpdate_userName
        from LotComments
        where recordDelete_timeMillis is null
        and lotId = ?
        order by lotCommentDate desc, lotCommentTime desc, lotCommentId desc`)
        .all(lotId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return lotComments;
}
export default getLotComments;
