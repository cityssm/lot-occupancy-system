import * as configFunctions from "./functions.config.js";
import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from "./lotOccupancyDB/getLotOccupantTypes.js";
import { getLotStatuses as getLotStatusesFromDatabase } from "./lotOccupancyDB/getLotStatuses.js";
import { getLotTypes as getLotTypesFromDatabase } from "./lotOccupancyDB/getLotTypes.js";
import { getOccupancyTypes as getOccupancyTypesFromDatabase } from "./lotOccupancyDB/getOccupancyTypes.js";
import { getOccupancyTypeFields as getOccupancyTypeFieldsFromDatabase } from "./lotOccupancyDB/getOccupancyTypeFields.js";
import { getWorkOrderTypes as getWorkOrderTypesFromDatabase } from "./lotOccupancyDB/getWorkOrderTypes.js";
import { getWorkOrderMilestoneTypes as getWorkOrderMilestoneTypesFromDatabase } from "./lotOccupancyDB/getWorkOrderMilestoneTypes.js";
let lotOccupantTypes;
export function getLotOccupantTypes() {
    if (!lotOccupantTypes) {
        lotOccupantTypes = getLotOccupantTypesFromDatabase();
    }
    return lotOccupantTypes;
}
export function getLotOccupantTypeById(lotOccupantTypeId) {
    const cachedLotOccupantTypes = getLotOccupantTypes();
    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantTypeId === lotOccupantTypeId;
    });
}
export function getLotOccupantTypeByLotOccupantType(lotOccupantType) {
    const cachedLotOccupantTypes = getLotOccupantTypes();
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();
    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });
}
function clearLotOccupantTypesCache() {
    lotOccupantTypes = undefined;
}
let lotStatuses;
export function getLotStatuses() {
    if (!lotStatuses) {
        lotStatuses = getLotStatusesFromDatabase();
    }
    return lotStatuses;
}
export function getLotStatusById(lotStatusId) {
    const cachedLotStatuses = getLotStatuses();
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatusId === lotStatusId;
    });
}
export function getLotStatusByLotStatus(lotStatus) {
    const cachedLotStatuses = getLotStatuses();
    const lotStatusLowerCase = lotStatus.toLowerCase();
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatus.toLowerCase() === lotStatusLowerCase;
    });
}
function clearLotStatusesCache() {
    lotStatuses = undefined;
}
let lotTypes;
export function getLotTypes() {
    if (!lotTypes) {
        lotTypes = getLotTypesFromDatabase();
    }
    return lotTypes;
}
export function getLotTypeById(lotTypeId) {
    const cachedLotTypes = getLotTypes();
    return cachedLotTypes.find((currentLotType) => {
        return currentLotType.lotTypeId === lotTypeId;
    });
}
export function getLotTypesByLotType(lotType) {
    const cachedLotTypes = getLotTypes();
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
export function getOccupancyTypes() {
    if (!occupancyTypes) {
        occupancyTypes = getOccupancyTypesFromDatabase();
    }
    return occupancyTypes;
}
export function getAllOccupancyTypeFields() {
    if (!allOccupancyTypeFields) {
        allOccupancyTypeFields = getOccupancyTypeFieldsFromDatabase();
    }
    return allOccupancyTypeFields;
}
export function getOccupancyTypeById(occupancyTypeId) {
    const cachedOccupancyTypes = getOccupancyTypes();
    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyTypeId === occupancyTypeId;
    });
}
export function getOccupancyTypeByOccupancyType(occupancyTypeString) {
    const cachedOccupancyTypes = getOccupancyTypes();
    const occupancyTypeLowerCase = occupancyTypeString.toLowerCase();
    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyType.toLowerCase() === occupancyTypeLowerCase;
    });
}
export function getOccupancyTypePrintsById(occupancyTypeId) {
    const occupancyType = getOccupancyTypeById(occupancyTypeId);
    if (!occupancyType || occupancyType.occupancyTypePrints.length === 0) {
        return [];
    }
    if (occupancyType.occupancyTypePrints.includes("*")) {
        return configFunctions.getProperty("settings.lotOccupancy.prints");
    }
    return occupancyType.occupancyTypePrints;
}
function clearOccupancyTypesCache() {
    occupancyTypes = undefined;
    allOccupancyTypeFields = undefined;
}
let workOrderTypes;
export function getWorkOrderTypes() {
    if (!workOrderTypes) {
        workOrderTypes = getWorkOrderTypesFromDatabase();
    }
    return workOrderTypes;
}
export function getWorkOrderTypeById(workOrderTypeId) {
    const cachedWorkOrderTypes = getWorkOrderTypes();
    return cachedWorkOrderTypes.find((currentWorkOrderType) => {
        return currentWorkOrderType.workOrderTypeId === workOrderTypeId;
    });
}
function clearWorkOrderTypesCache() {
    workOrderTypes = undefined;
}
let workOrderMilestoneTypes;
export function getWorkOrderMilestoneTypes() {
    if (!workOrderMilestoneTypes) {
        workOrderMilestoneTypes = getWorkOrderMilestoneTypesFromDatabase();
    }
    return workOrderMilestoneTypes;
}
export function getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId(workOrderMilestoneTypeId) {
    const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return currentWorkOrderMilestoneType.workOrderMilestoneTypeId === workOrderMilestoneTypeId;
    });
}
export function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(workOrderMilestoneTypeString) {
    const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    const workOrderMilestoneTypeLowerCase = workOrderMilestoneTypeString.toLowerCase();
    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return (currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
            workOrderMilestoneTypeLowerCase);
    });
}
function clearWorkOrderMilestoneTypesCache() {
    workOrderMilestoneTypes = undefined;
}
export function clearCacheByTableName(tableName) {
    switch (tableName) {
        case "LotOccupantTypes": {
            clearLotOccupantTypesCache();
            break;
        }
        case "LotStatuses": {
            clearLotStatusesCache();
            break;
        }
        case "LotTypes":
        case "LotTypeFields": {
            clearLotTypesCache();
            break;
        }
        case "OccupancyTypes":
        case "OccupancyTypeFields":
        case "OccupancyTypePrints": {
            clearOccupancyTypesCache();
            break;
        }
        case "WorkOrderMilestoneTypes": {
            clearWorkOrderMilestoneTypesCache();
            break;
        }
        case "WorkOrderTypes": {
            clearWorkOrderTypesCache();
            break;
        }
    }
}
