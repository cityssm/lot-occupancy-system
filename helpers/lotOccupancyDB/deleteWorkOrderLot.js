import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
export function deleteWorkOrderLot(workOrderId, lotId, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrderLots
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where workOrderId = ?
        and lotId = ?`)
        .run(requestSession.user.userName, rightNowMillis, workOrderId, lotId);
    database.close();
    return result.changes > 0;
}
export default deleteWorkOrderLot;
