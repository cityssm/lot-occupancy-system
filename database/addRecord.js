import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { acquireConnection } from './pool.js';
const recordNameColumns = new Map();
recordNameColumns.set('FeeCategories', 'feeCategory');
recordNameColumns.set('LotStatuses', 'lotStatus');
recordNameColumns.set('LotTypes', 'lotType');
recordNameColumns.set('OccupancyTypes', 'occupancyType');
recordNameColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneType');
recordNameColumns.set('WorkOrderTypes', 'workOrderType');
export async function addRecord(recordTable, recordName, orderNumber, user) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into ${recordTable} (
        ${recordNameColumns.get(recordTable)},
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?)`)
        .run(recordName, orderNumber === '' ? -1 : orderNumber, user.userName, rightNowMillis, user.userName, rightNowMillis);
    database.release();
    clearCacheByTableName(recordTable);
    return result.lastInsertRowid;
}
