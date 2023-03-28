import { acquireConnection } from './pool.js';
export async function deleteWorkOrderLot(workOrderId, lotId, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotId = ?`)
        .run(requestSession.user.userName, Date.now(), workOrderId, lotId);
    database.release();
    return result.changes > 0;
}
export default deleteWorkOrderLot;
