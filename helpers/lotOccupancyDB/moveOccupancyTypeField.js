import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { clearCacheByTableName } from '../functions.cache.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
function getCurrentField(occupancyTypeFieldId, connectedDatabase) {
    const currentField = connectedDatabase
        .prepare(`select occupancyTypeId, orderNumber
          from OccupancyTypeFields
          where occupancyTypeFieldId = ?`)
        .get(occupancyTypeFieldId);
    return currentField;
}
export function moveOccupancyTypeFieldDown(occupancyTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    database
        .prepare('update OccupancyTypeFields' +
        ' set orderNumber = orderNumber - 1' +
        ' where recordDelete_timeMillis is null' +
        (currentField.occupancyTypeId
            ? " and occupancyTypeId = '" + currentField.occupancyTypeId + "'"
            : ' and occupancyTypeId is null') +
        ' and orderNumber = ? + 1')
        .run(currentField.orderNumber);
    const success = updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, currentField.orderNumber + 1, database);
    database.close();
    clearCacheByTableName('OccupancyTypeFields');
    return success;
}
export function moveOccupancyTypeFieldDownToBottom(occupancyTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    const occupancyTypeParameters = [];
    if (currentField.occupancyTypeId) {
        occupancyTypeParameters.push(currentField.occupancyTypeId);
    }
    const maxOrderNumber = database
        .prepare('select max(orderNumber) as maxOrderNumber' +
        ' from OccupancyTypeFields' +
        ' where recordDelete_timeMillis is null' +
        (currentField.occupancyTypeId
            ? ' and occupancyTypeId = ?'
            : ' and occupancyTypeId is null'))
        .get(occupancyTypeParameters).maxOrderNumber;
    if (currentField.orderNumber !== maxOrderNumber) {
        updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, maxOrderNumber + 1, database);
        occupancyTypeParameters.push(currentField.orderNumber);
        database
            .prepare('update OccupancyTypeFields' +
            ' set orderNumber = orderNumber - 1' +
            ' where recordDelete_timeMillis is null' +
            (currentField.occupancyTypeId
                ? ' and occupancyTypeId = ?'
                : ' and occupancyTypeId is null') +
            ' and orderNumber > ?')
            .run(occupancyTypeParameters);
    }
    database.close();
    clearCacheByTableName('OccupancyTypeFields');
    return true;
}
export function moveOccupancyTypeFieldUp(occupancyTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    if (currentField.orderNumber <= 0) {
        database.close();
        return true;
    }
    database
        .prepare('update OccupancyTypeFields' +
        ' set orderNumber = orderNumber + 1' +
        ' where recordDelete_timeMillis is null' +
        (currentField.occupancyTypeId
            ? " and occupancyTypeId = '" + currentField.occupancyTypeId + "'"
            : ' and occupancyTypeId is null') +
        ' and orderNumber = ? - 1')
        .run(currentField.orderNumber);
    const success = updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, currentField.orderNumber - 1, database);
    database.close();
    clearCacheByTableName('OccupancyTypeFields');
    return success;
}
export function moveOccupancyTypeFieldUpToTop(occupancyTypeFieldId) {
    const database = sqlite(databasePath);
    const currentField = getCurrentField(occupancyTypeFieldId, database);
    if (currentField.orderNumber > 0) {
        updateRecordOrderNumber('OccupancyTypeFields', occupancyTypeFieldId, -1, database);
        const occupancyTypeParameters = [];
        if (currentField.occupancyTypeId) {
            occupancyTypeParameters.push(currentField.occupancyTypeId);
        }
        occupancyTypeParameters.push(currentField.orderNumber);
        database
            .prepare('update OccupancyTypeFields' +
            ' set orderNumber = orderNumber + 1' +
            ' where recordDelete_timeMillis is null' +
            (currentField.occupancyTypeId
                ? ' and occupancyTypeId = ?'
                : ' and occupancyTypeId is null') +
            ' and orderNumber < ?')
            .run(occupancyTypeParameters);
    }
    database.close();
    clearCacheByTableName('OccupancyTypeFields');
    return true;
}
