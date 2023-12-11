import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
function getCurrentField(occupancyTypeFieldId, connectedDatabase) {
    return connectedDatabase
        .prepare(`select occupancyTypeId, orderNumber
        from OccupancyTypeFields
        where occupancyTypeFieldId = ?`)
        .get(occupancyTypeFieldId);
}
export async function moveOccupancyTypeFieldDown(occupancyTypeFieldId) {
    const database = await acquireConnection();
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    database
        .prepare(`update OccupancyTypeFields
        set orderNumber = orderNumber - 1
        where recordDelete_timeMillis is null
        ${currentField.occupancyTypeId === undefined
        ? ' and occupancyTypeId is null'
        : ` and occupancyTypeId = '${currentField.occupancyTypeId.toString()}'`}
        and orderNumber = ? + 1`)
        .run(currentField.orderNumber);
    const success = updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, currentField.orderNumber + 1, database);
    database.release();
    clearCacheByTableName('OccupancyTypeFields');
    return success;
}
export async function moveOccupancyTypeFieldDownToBottom(occupancyTypeFieldId) {
    const database = await acquireConnection();
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    const occupancyTypeParameters = [];
    if (currentField.occupancyTypeId) {
        occupancyTypeParameters.push(currentField.occupancyTypeId);
    }
    const maxOrderNumber = database
        .prepare(`select max(orderNumber) as maxOrderNumber
          from OccupancyTypeFields
          where recordDelete_timeMillis is null
          ${currentField.occupancyTypeId === undefined
        ? ' and occupancyTypeId is null'
        : ' and occupancyTypeId = ?'}`)
        .get(occupancyTypeParameters).maxOrderNumber;
    if (currentField.orderNumber !== maxOrderNumber) {
        updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, maxOrderNumber + 1, database);
        occupancyTypeParameters.push(currentField.orderNumber);
        database
            .prepare(`update OccupancyTypeFields set orderNumber = orderNumber - 1
          where recordDelete_timeMillis is null
          ${currentField.occupancyTypeId === undefined
            ? ' and occupancyTypeId is null'
            : ' and occupancyTypeId = ?'}
          and orderNumber > ?`)
            .run(occupancyTypeParameters);
    }
    database.release();
    clearCacheByTableName('OccupancyTypeFields');
    return true;
}
export async function moveOccupancyTypeFieldUp(occupancyTypeFieldId) {
    const database = await acquireConnection();
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    if (currentField.orderNumber <= 0) {
        database.release();
        return true;
    }
    database
        .prepare(`update OccupancyTypeFields
        set orderNumber = orderNumber + 1
        where recordDelete_timeMillis is null
        ${currentField.occupancyTypeId === undefined
        ? ' and occupancyTypeId is null'
        : ` and occupancyTypeId = '${currentField.occupancyTypeId.toString()}'`}
        and orderNumber = ? - 1`)
        .run(currentField.orderNumber);
    const success = updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, currentField.orderNumber - 1, database);
    database.release();
    clearCacheByTableName('OccupancyTypeFields');
    return success;
}
export async function moveOccupancyTypeFieldUpToTop(occupancyTypeFieldId) {
    const database = await acquireConnection();
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    if (currentField.orderNumber > 0) {
        updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, -1, database);
        const occupancyTypeParameters = [];
        if (currentField.occupancyTypeId) {
            occupancyTypeParameters.push(currentField.occupancyTypeId);
        }
        occupancyTypeParameters.push(currentField.orderNumber);
        database
            .prepare(`update OccupancyTypeFields
          set orderNumber = orderNumber + 1
          where recordDelete_timeMillis is null
          ${currentField.occupancyTypeId
            ? ' and occupancyTypeId = ?'
            : ' and occupancyTypeId is null'} and orderNumber < ?`)
            .run(occupancyTypeParameters);
    }
    database.release();
    clearCacheByTableName('OccupancyTypeFields');
    return true;
}
