import { acquireConnection } from './pool.js';
export async function addWorkOrderLotOccupancy(workOrderLotOccupancyForm, requestSession, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const rightNowMillis = Date.now();
    const row = database
        .prepare(`select recordDelete_timeMillis
        from WorkOrderLotOccupancies
        where workOrderId = ?
        and lotOccupancyId = ?`)
        .get(workOrderLotOccupancyForm.workOrderId, workOrderLotOccupancyForm.lotOccupancyId);
    if (row) {
        if (row.recordDelete_timeMillis) {
            database
                .prepare(`update WorkOrderLotOccupancies
            set recordCreate_userName = ?,
            recordCreate_timeMillis = ?,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?,
            recordDelete_userName = null,
            recordDelete_timeMillis = null
            where workOrderId = ?
            and lotOccupancyId = ?`)
                .run(requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis, workOrderLotOccupancyForm.workOrderId, workOrderLotOccupancyForm.lotOccupancyId);
        }
    }
    else {
        database
            .prepare(`insert into WorkOrderLotOccupancies (
          workOrderId, lotOccupancyId,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?)`)
            .run(workOrderLotOccupancyForm.workOrderId, workOrderLotOccupancyForm.lotOccupancyId, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return true;
}
export default addWorkOrderLotOccupancy;
