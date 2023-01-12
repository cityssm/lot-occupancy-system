import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
export function deleteWorkOrderLotOccupancy(workOrderId, lotOccupancyId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderLotOccupancies
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotOccupancyId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderId, lotOccupancyId);
    database.close();
    return result.changes > 0;
}
export default deleteWorkOrderLotOccupancy;
