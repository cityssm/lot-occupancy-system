import { acquireConnection } from './pool.js';
import { clearCacheByTableName } from '../functions.cache.js';
const recordNameIdColumns = new Map();
recordNameIdColumns.set('FeeCategories', ['feeCategory', 'feeCategoryId']);
recordNameIdColumns.set('LotStatuses', ['lotStatus', 'lotStatusId']);
recordNameIdColumns.set('LotTypes', ['lotType', 'lotTypeId']);
recordNameIdColumns.set('OccupancyTypes', ['occupancyType', 'occupancyTypeId']);
recordNameIdColumns.set('WorkOrderMilestoneTypes', [
    'workOrderMilestoneType',
    'workOrderMilestoneTypeId'
]);
recordNameIdColumns.set('WorkOrderTypes', ['workOrderType', 'workOrderTypeId']);
export async function updateRecord(recordTable, recordId, recordName, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update ${recordTable}
        set ${recordNameIdColumns.get(recordTable)[0]} = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and ${recordNameIdColumns.get(recordTable)[1]} = ?`)
        .run(recordName, requestSession.user.userName, Date.now(), recordId);
    database.release();
    clearCacheByTableName(recordTable);
    return result.changes > 0;
}
