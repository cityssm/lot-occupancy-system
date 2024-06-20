import { acquireConnection } from './pool.js';
export default async function deleteWorkOrderLot(workOrderId, lotId, user) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotId = ?`)
        .run(user.userName, Date.now(), workOrderId, lotId);
    database.release();
    return result.changes > 0;
}
