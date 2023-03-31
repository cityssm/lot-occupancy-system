import cluster from 'node:cluster';
import * as configFunctions from './functions.config.js';
import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from './lotOccupancyDB/getLotOccupantTypes.js';
import { getLotStatuses as getLotStatusesFromDatabase } from './lotOccupancyDB/getLotStatuses.js';
import { getLotTypes as getLotTypesFromDatabase } from './lotOccupancyDB/getLotTypes.js';
import { getOccupancyTypes as getOccupancyTypesFromDatabase } from './lotOccupancyDB/getOccupancyTypes.js';
import { getOccupancyTypeFields as getOccupancyTypeFieldsFromDatabase } from './lotOccupancyDB/getOccupancyTypeFields.js';
import { getWorkOrderTypes as getWorkOrderTypesFromDatabase } from './lotOccupancyDB/getWorkOrderTypes.js';
import { getWorkOrderMilestoneTypes as getWorkOrderMilestoneTypesFromDatabase } from './lotOccupancyDB/getWorkOrderMilestoneTypes.js';
import Debug from 'debug';
const debug = Debug(`lot-occupancy-system:functions.cache:${process.pid}`);
let lotOccupantTypes;
export async function getLotOccupantTypes() {
    if (lotOccupantTypes === undefined) {
        lotOccupantTypes = await getLotOccupantTypesFromDatabase();
    }
    return lotOccupantTypes;
}
export async function getLotOccupantTypeById(lotOccupantTypeId) {
    const cachedLotOccupantTypes = await getLotOccupantTypes();
    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantTypeId === lotOccupantTypeId;
    });
}
export async function getLotOccupantTypeByLotOccupantType(lotOccupantType) {
    const cachedLotOccupantTypes = await getLotOccupantTypes();
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();
    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return (currentLotOccupantType.lotOccupantType.toLowerCase() ===
            lotOccupantTypeLowerCase);
    });
}
function clearLotOccupantTypesCache() {
    lotOccupantTypes = undefined;
}
let lotStatuses;
export async function getLotStatuses() {
    if (lotStatuses === undefined) {
        lotStatuses = await getLotStatusesFromDatabase();
    }
    return lotStatuses;
}
export async function getLotStatusById(lotStatusId) {
    const cachedLotStatuses = await getLotStatuses();
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatusId === lotStatusId;
    });
}
export async function getLotStatusByLotStatus(lotStatus) {
    const cachedLotStatuses = await getLotStatuses();
    const lotStatusLowerCase = lotStatus.toLowerCase();
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatus.toLowerCase() === lotStatusLowerCase;
    });
}
function clearLotStatusesCache() {
    lotStatuses = undefined;
}
let lotTypes;
export async function getLotTypes() {
    if (lotTypes === undefined) {
        lotTypes = await getLotTypesFromDatabase();
    }
    return lotTypes;
}
export async function getLotTypeById(lotTypeId) {
    const cachedLotTypes = await getLotTypes();
    return cachedLotTypes.find((currentLotType) => {
        return currentLotType.lotTypeId === lotTypeId;
    });
}
export async function getLotTypesByLotType(lotType) {
    const cachedLotTypes = await getLotTypes();
    const lotTypeLowerCase = lotType.toLowerCase();
    return cachedLotTypes.find((currentLotType) => {
        return currentLotType.lotType.toLowerCase() === lotTypeLowerCase;
    });
}
function clearLotTypesCache() {
    lotTypes = undefined;
}
let occupancyTypes;
let allOccupancyTypeFields;
export async function getOccupancyTypes() {
    if (occupancyTypes === undefined) {
        occupancyTypes = await getOccupancyTypesFromDatabase();
    }
    return occupancyTypes;
}
export async function getAllOccupancyTypeFields() {
    if (allOccupancyTypeFields === undefined) {
        allOccupancyTypeFields = await getOccupancyTypeFieldsFromDatabase();
    }
    return allOccupancyTypeFields;
}
export async function getOccupancyTypeById(occupancyTypeId) {
    const cachedOccupancyTypes = await getOccupancyTypes();
    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyTypeId === occupancyTypeId;
    });
}
export async function getOccupancyTypeByOccupancyType(occupancyTypeString) {
    const cachedOccupancyTypes = await getOccupancyTypes();
    const occupancyTypeLowerCase = occupancyTypeString.toLowerCase();
    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return (currentOccupancyType.occupancyType.toLowerCase() ===
            occupancyTypeLowerCase);
    });
}
export async function getOccupancyTypePrintsById(occupancyTypeId) {
    const occupancyType = await getOccupancyTypeById(occupancyTypeId);
    if (occupancyType === undefined ||
        (occupancyType.occupancyTypePrints ?? []).length === 0) {
        return [];
    }
    if (occupancyType.occupancyTypePrints.includes('*')) {
        return configFunctions.getProperty('settings.lotOccupancy.prints');
    }
    return occupancyType.occupancyTypePrints;
}
function clearOccupancyTypesCache() {
    occupancyTypes = undefined;
    allOccupancyTypeFields = undefined;
}
let workOrderTypes;
export async function getWorkOrderTypes() {
    if (workOrderTypes === undefined) {
        workOrderTypes = await getWorkOrderTypesFromDatabase();
    }
    return workOrderTypes;
}
export async function getWorkOrderTypeById(workOrderTypeId) {
    const cachedWorkOrderTypes = await getWorkOrderTypes();
    return cachedWorkOrderTypes.find((currentWorkOrderType) => {
        return currentWorkOrderType.workOrderTypeId === workOrderTypeId;
    });
}
function clearWorkOrderTypesCache() {
    workOrderTypes = undefined;
}
let workOrderMilestoneTypes;
export async function getWorkOrderMilestoneTypes() {
    if (workOrderMilestoneTypes === undefined) {
        workOrderMilestoneTypes = await getWorkOrderMilestoneTypesFromDatabase();
    }
    return workOrderMilestoneTypes;
}
export async function getWorkOrderMilestoneTypeById(workOrderMilestoneTypeId) {
    const cachedWorkOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return (currentWorkOrderMilestoneType.workOrderMilestoneTypeId ===
            workOrderMilestoneTypeId);
    });
}
export async function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(workOrderMilestoneTypeString) {
    const cachedWorkOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    const workOrderMilestoneTypeLowerCase = workOrderMilestoneTypeString.toLowerCase();
    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return (currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
            workOrderMilestoneTypeLowerCase);
    });
}
export async function preloadCaches() {
    debug('Preloading caches');
    await getLotOccupantTypes();
    await getLotStatuses();
    await getLotTypes();
    await getOccupancyTypes();
    await getWorkOrderTypes();
    await getWorkOrderMilestoneTypes();
}
function clearWorkOrderMilestoneTypesCache() {
    workOrderMilestoneTypes = undefined;
}
export function clearCacheByTableName(tableName, relayMessage = true) {
    switch (tableName) {
        case 'LotOccupantTypes': {
            clearLotOccupantTypesCache();
            break;
        }
        case 'LotStatuses': {
            clearLotStatusesCache();
            break;
        }
        case 'LotTypes':
        case 'LotTypeFields': {
            clearLotTypesCache();
            break;
        }
        case 'OccupancyTypes':
        case 'OccupancyTypeFields':
        case 'OccupancyTypePrints': {
            clearOccupancyTypesCache();
            break;
        }
        case 'WorkOrderMilestoneTypes': {
            clearWorkOrderMilestoneTypesCache();
            break;
        }
        case 'WorkOrderTypes': {
            clearWorkOrderTypesCache();
            break;
        }
    }
    try {
        if (relayMessage && cluster.isWorker) {
            const workerMessage = {
                messageType: 'clearCache',
                tableName,
                timeMillis: Date.now(),
                pid: process.pid
            };
            debug(`Sending clear cache from worker: ${tableName}`);
            process.send(workerMessage);
        }
    }
    catch { }
}
process.on('message', (message) => {
    if (message.messageType === 'clearCache' && message.pid !== process.pid) {
        debug(`Clearing cache: ${message.tableName}`);
        clearCacheByTableName(message.tableName, false);
    }
});
