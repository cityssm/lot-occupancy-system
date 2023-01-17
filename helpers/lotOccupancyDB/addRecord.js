import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { clearCacheByTableName } from '../functions.cache.js';
const recordNameColumns = new Map();
recordNameColumns.set('FeeCategories', 'feeCategory');
recordNameColumns.set('LotStatuses', 'lotStatus');
recordNameColumns.set('LotTypes', 'lotType');
recordNameColumns.set('OccupancyTypes', 'occupancyType');
recordNameColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneType');
recordNameColumns.set('WorkOrderTypes', 'workOrderType');
export function addRecord(recordTable, recordName, orderNumber, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into ${recordTable} (
        ${recordNameColumns.get(recordTable)},
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?)`)
        .run(recordName, orderNumber === '' ? -1 : orderNumber, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    clearCacheByTableName(recordTable);
    return result.lastInsertRowid;
}
