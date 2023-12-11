import { dateIntegerToString, timeIntegerToString, timeIntegerToPeriodString } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export async function getWorkOrderComments(workOrderId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    database.function('userFn_dateIntegerToString', dateIntegerToString);
    database.function('userFn_timeIntegerToString', timeIntegerToString);
    database.function('userFn_timeIntegerToPeriodString', timeIntegerToPeriodString);
    const workOrderComments = database
        .prepare(`select workOrderCommentId,
        workOrderCommentDate, userFn_dateIntegerToString(workOrderCommentDate) as workOrderCommentDateString,
        workOrderCommentTime,
        userFn_timeIntegerToString(workOrderCommentTime) as workOrderCommentTimeString,
        userFn_timeIntegerToPeriodString(workOrderCommentTime) as workOrderCommentTimePeriodString,
        workOrderComment,
        recordCreate_userName, recordUpdate_userName
        from WorkOrderComments
        where recordDelete_timeMillis is null
        and workOrderId = ?
        order by workOrderCommentDate desc, workOrderCommentTime desc, workOrderCommentId desc`)
        .all(workOrderId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return workOrderComments;
}
export default getWorkOrderComments;
