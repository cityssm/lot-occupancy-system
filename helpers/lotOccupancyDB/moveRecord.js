import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { clearCacheByTableName } from '../functions.cache.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
const recordIdColumns = new Map();
recordIdColumns.set('FeeCategories', 'feeCategoryId');
recordIdColumns.set('LotOccupantTypes', 'lotOccupantTypeId');
recordIdColumns.set('LotStatuses', 'lotStatusId');
recordIdColumns.set('LotTypes', 'lotTypeId');
recordIdColumns.set('OccupancyTypes', 'occupancyTypeId');
recordIdColumns.set('WorkOrderMilestoneTypes', 'workOrderMilestoneTypeId');
recordIdColumns.set('WorkOrderTypes', 'workOrderTypeId');
function getCurrentOrderNumber(recordTable, recordId, database) {
    const currentOrderNumber = database
        .prepare(`select orderNumber
                from ${recordTable}
                where ${recordIdColumns.get(recordTable)} = ?`)
        .get(recordId).orderNumber;
    return currentOrderNumber;
}
export function moveRecordDown(recordTable, recordId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);
    database
        .prepare(`update ${recordTable}
        set orderNumber = orderNumber - 1
        where recordDelete_timeMillis is null
        and orderNumber = ? + 1`)
        .run(currentOrderNumber);
    const success = updateRecordOrderNumber(recordTable, recordId, currentOrderNumber + 1, database);
    database.close();
    clearCacheByTableName(recordTable);
    return success;
}
export function moveRecordDownToBottom(recordTable, recordId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
        from ${recordTable}
        where recordDelete_timeMillis is null`)
        .get().maxOrderNumber;
    if (currentOrderNumber !== maxOrderNumber) {
        updateRecordOrderNumber(recordTable, recordId, maxOrderNumber + 1, database);
        database
            .prepare(`update ${recordTable}
            set orderNumber = orderNumber - 1
            where recordDelete_timeMillis is null
            and orderNumber > ?`)
            .run(currentOrderNumber);
    }
    database.close();
    clearCacheByTableName(recordTable);
    return true;
}
export function moveRecordUp(recordTable, recordId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);
    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }
    database
        .prepare(`update ${recordTable}
        set orderNumber = orderNumber + 1
        where recordDelete_timeMillis is null
        and orderNumber = ? - 1`)
        .run(currentOrderNumber);
    const success = updateRecordOrderNumber(recordTable, recordId, currentOrderNumber - 1, database);
    database.close();
    clearCacheByTableName(recordTable);
    return success;
}
export function moveRecordUpToTop(recordTable, recordId) {
    const database = sqlite(databasePath);
    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);
    if (currentOrderNumber > 0) {
        updateRecordOrderNumber(recordTable, recordId, -1, database);
        database
            .prepare(`update ${recordTable}
            set orderNumber = orderNumber + 1
            where recordDelete_timeMillis is null
            and orderNumber < ?`)
            .run(currentOrderNumber);
    }
    database.close();
    clearCacheByTableName(recordTable);
    return true;
}
