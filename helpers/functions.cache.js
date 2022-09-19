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
export function getLotOccupantTypesByLotOccupantType(lotOccupantType) {
    const cachedLotOccupantTypes = getLotOccupantTypes();
    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();
    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });
}
export function clearLotOccupantTypesCache() {
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
export function clearLotStatusesCache() {
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
export function clearLotTypesCache() {
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
export function clearOccupancyTypesCache() {
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
export function clearWorkOrderTypesCache() {
    workOrderTypes = undefined;
}
let workOrderMilestoneTypes;
export function getWorkOrderMilestoneTypes() {
    if (!workOrderMilestoneTypes) {
        workOrderMilestoneTypes = getWorkOrderMilestoneTypesFromDatabase();
    }
    return workOrderMilestoneTypes;
}
export function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(workOrderMilestoneTypeString) {
    const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    const workOrderMilestoneTypeLowerCase = workOrderMilestoneTypeString.toLowerCase();
    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return (currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
            workOrderMilestoneTypeLowerCase);
    });
}
export function clearWorkOrderMilestoneTypesCache() {
    workOrderMilestoneTypes = undefined;
}
