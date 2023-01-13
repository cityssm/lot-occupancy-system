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
export const preneedOwnerLotOccupantTypeId = cacheFunctions.getLotOccupantTypeByLotOccupantType('Preneed Owner').lotOccupantTypeId;
export const funeralDirectorLotOccupantTypeId = cacheFunctions.getLotOccupantTypeByLotOccupantType('Funeral Director').lotOccupantTypeId;
export const deceasedLotOccupantTypeId = cacheFunctions.getLotOccupantTypeByLotOccupantType('Deceased').lotOccupantTypeId;
export const purchaserLotOccupantTypeId = cacheFunctions.getLotOccupantTypeByLotOccupantType('Purchaser').lotOccupantTypeId;
export const availableLotStatusId = cacheFunctions.getLotStatusByLotStatus('Available').lotStatusId;
export const reservedLotStatusId = cacheFunctions.getLotStatusByLotStatus('Reserved').lotStatusId;
export const takenLotStatusId = cacheFunctions.getLotStatusByLotStatus('Taken').lotStatusId;
const casketLotTypeId = cacheFunctions.getLotTypesByLotType('Casket Grave').lotTypeId;
const columbariumLotTypeId = cacheFunctions.getLotTypesByLotType('Columbarium').lotTypeId;
const crematoriumLotTypeId = cacheFunctions.getLotTypesByLotType('Crematorium').lotTypeId;
const mausoleumLotTypeId = cacheFunctions.getLotTypesByLotType('Mausoleum').lotTypeId;
const nicheWallLotTypeId = cacheFunctions.getLotTypesByLotType('Niche Wall').lotTypeId;
const urnGardenLotTypeId = cacheFunctions.getLotTypesByLotType('Urn Garden').lotTypeId;
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
export const preneedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType('Preneed');
export const deceasedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType('Interment');
export const cremationOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType('Cremation');
export const acknowledgedWorkOrderMilestoneTypeId = cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Acknowledged')?.workOrderMilestoneTypeId;
export const deathWorkOrderMilestoneTypeId = cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Death')?.workOrderMilestoneTypeId;
export const funeralWorkOrderMilestoneTypeId = cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Funeral')?.workOrderMilestoneTypeId;
export const cremationWorkOrderMilestoneTypeId = cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Cremation')?.workOrderMilestoneTypeId;
export const intermentWorkOrderMilestoneTypeId = cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType('Interment')?.workOrderMilestoneTypeId;
export const workOrderTypeId = 1;
