import { dateIntegerToString, timeIntegerToPeriodString, timeIntegerToString } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export default async function getLotComments(lotId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    database.function('userFn_dateIntegerToString', dateIntegerToString);
    database.function('userFn_timeIntegerToString', timeIntegerToString);
    database.function('userFn_timeIntegerToPeriodString', timeIntegerToPeriodString);
    const lotComments = database
        .prepare(`select lotCommentId,
        lotCommentDate, userFn_dateIntegerToString(lotCommentDate) as lotCommentDateString,
        lotCommentTime,
        userFn_timeIntegerToString(lotCommentTime) as lotCommentTimeString,
        userFn_timeIntegerToPeriodString(lotCommentTime) as lotCommentTimePeriodString,
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
