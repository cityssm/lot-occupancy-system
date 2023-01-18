import { acquireConnection } from './pool.js';
export async function deleteWorkOrderLotOccupancy(workOrderId, lotOccupancyId, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderLotOccupancies
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotOccupancyId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderId, lotOccupancyId);
    database.release();
    return result.changes > 0;
}
export default deleteWorkOrderLotOccupancy;
