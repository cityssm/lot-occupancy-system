import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../data/databasePaths.js';
import * as cacheFunctions from '../helpers/functions.cache.js';
const feeCache = new Map();
export function getFeeIdByFeeDescription(feeDescription) {
    if (feeCache.keys.length === 0) {
        const database = sqlite(databasePath, {
            readonly: true
        });
        const records = database
            .prepare("select feeId, feeDescription from Fees where feeDescription like 'CMPP_FEE_%'")
            .all();
        for (const record of records) {
            feeCache.set(record.feeDescription, record.feeId);
        }
        database.close();
    }
    return feeCache.get(feeDescription);
}
export const preneedOwnerLotOccupantTypeId = (await cacheFunctions.getLotOccupantTypeByLotOccupantType('Preneed Owner'))
    .lotOccupantTypeId;
export const funeralDirectorLotOccupantTypeId = (await cacheFunctions.getLotOccupantTypeByLotOccupantType('Funeral Director')).lotOccupantTypeId;
export const deceasedLotOccupantTypeId = (await cacheFunctions.getLotOccupantTypeByLotOccupantType('Deceased'))
    .lotOccupantTypeId;
export const purchaserLotOccupantTypeId = (await cacheFunctions.getLotOccupantTypeByLotOccupantType('Purchaser'))
    .lotOccupantTypeId;
export const availableLotStatusId = (await cacheFunctions.getLotStatusByLotStatus('Available')).lotStatusId;
export const reservedLotStatusId = (await cacheFunctions.getLotStatusByLotStatus('Reserved')).lotStatusId;
export const takenLotStatusId = (await cacheFunctions.getLotStatusByLotStatus('Taken')).lotStatusId;
const casketLotTypeId = (await cacheFunctions.getLotTypesByLotType('Casket Grave')).lotTypeId;
const columbariumLotTypeId = (await cacheFunctions.getLotTypesByLotType('Columbarium')).lotTypeId;
const crematoriumLotTypeId = (await cacheFunctions.getLotTypesByLotType('Crematorium')).lotTypeId;
const mausoleumLotTypeId = (await cacheFunctions.getLotTypesByLotType('Mausoleum')).lotTypeId;
const nicheWallLotTypeId = (await cacheFunctions.getLotTypesByLotType('Niche Wall')).lotTypeId;
const urnGardenLotTypeId = (await cacheFunctions.getLotTypesByLotType('Urn Garden')).lotTypeId;
export function getLotTypeId(dataRow) {
    switch (dataRow.cemetery) {
        case '00': {
            return crematoriumLotTypeId;
        }
        case 'GC':
        case 'HC': {
            return columbariumLotTypeId;
        }
        case 'MA': {
            return mausoleumLotTypeId;
        }
        case 'MN':
        case 'NW': {
            return nicheWallLotTypeId;
        }
        case 'UG': {
            return urnGardenLotTypeId;
        }
    }
    return casketLotTypeId;
}
export const preneedOccupancyType = (await cacheFunctions.getOccupancyTypeByOccupancyType('Preneed'));
export const deceasedOccupancyType = (await cacheFunctions.getOccupancyTypeByOccupancyType('Interment'));
export const cremationOccupancyType = (await cacheFunctions.getOccupancyTypeByOccupancyType('Cremation'));
export const acknowledgedWorkOrderMilestoneTypeId = (await cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Acknowledged'))?.workOrderMilestoneTypeId;
export const deathWorkOrderMilestoneTypeId = (await cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Death'))?.workOrderMilestoneTypeId;
export const funeralWorkOrderMilestoneTypeId = (await cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Funeral'))?.workOrderMilestoneTypeId;
export const cremationWorkOrderMilestoneTypeId = (await cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Cremation'))?.workOrderMilestoneTypeId;
export const intermentWorkOrderMilestoneTypeId = (await cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Interment'))?.workOrderMilestoneTypeId;
export const workOrderTypeId = 1;
