import * as configFunctions from "./functions.config.js";

import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from "./lotOccupancyDB/getLotOccupantTypes.js";

import { getLotStatuses as getLotStatusesFromDatabase } from "./lotOccupancyDB/getLotStatuses.js";

import { getLotTypes as getLotTypesFromDatabase } from "./lotOccupancyDB/getLotTypes.js";

import { getOccupancyTypes as getOccupancyTypesFromDatabase } from "./lotOccupancyDB/getOccupancyTypes.js";
import { getOccupancyTypeFields as getOccupancyTypeFieldsFromDatabase } from "./lotOccupancyDB/getOccupancyTypeFields.js";

import { getWorkOrderTypes as getWorkOrderTypesFromDatabase } from "./lotOccupancyDB/getWorkOrderTypes.js";

import { getWorkOrderMilestoneTypes as getWorkOrderMilestoneTypesFromDatabase } from "./lotOccupancyDB/getWorkOrderMilestoneTypes.js";

import type * as recordTypes from "../types/recordTypes";

/*
 * Lot Occupant Types
 */

let lotOccupantTypes: recordTypes.LotOccupantType[] | undefined;

export function getLotOccupantTypes() {
    if (!lotOccupantTypes) {
        lotOccupantTypes = getLotOccupantTypesFromDatabase();
    }

    return lotOccupantTypes;
}

export function getLotOccupantTypeById(lotOccupantTypeId: number) {
    const cachedLotOccupantTypes = getLotOccupantTypes();

    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantTypeId === lotOccupantTypeId;
    });
}

export function getLotOccupantTypeByLotOccupantType(lotOccupantType: string) {
    const cachedLotOccupantTypes = getLotOccupantTypes();

    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();

    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });
}

export function clearLotOccupantTypesCache() {
    lotOccupantTypes = undefined;
}

/*
 * Lot Statuses
 */

let lotStatuses: recordTypes.LotStatus[] | undefined;

export function getLotStatuses() {
    if (!lotStatuses) {
        lotStatuses = getLotStatusesFromDatabase();
    }

    return lotStatuses;
}

export function getLotStatusById(lotStatusId: number) {
    const cachedLotStatuses = getLotStatuses();

    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatusId === lotStatusId;
    });
}

export function getLotStatusByLotStatus(lotStatus: string) {
    const cachedLotStatuses = getLotStatuses();

    const lotStatusLowerCase = lotStatus.toLowerCase();

    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatus.toLowerCase() === lotStatusLowerCase;
    });
}

export function clearLotStatusesCache() {
    lotStatuses = undefined;
}

/*
 * Lot Types
 */

let lotTypes: recordTypes.LotType[] | undefined;

export function getLotTypes() {
    if (!lotTypes) {
        lotTypes = getLotTypesFromDatabase();
    }

    return lotTypes;
}

export function getLotTypeById(lotTypeId: number) {
    const cachedLotTypes = getLotTypes();

    return cachedLotTypes.find((currentLotType) => {
        return currentLotType.lotTypeId === lotTypeId;
    });
}

export function getLotTypesByLotType(lotType: string) {
    const cachedLotTypes = getLotTypes();

    const lotTypeLowerCase = lotType.toLowerCase();

    return cachedLotTypes.find((currentLotType) => {
        return currentLotType.lotType.toLowerCase() === lotTypeLowerCase;
    });
}

export function clearLotTypesCache() {
    lotTypes = undefined;
}

/*
 * Occupancy Types
 */

let occupancyTypes: recordTypes.OccupancyType[] | undefined;
let allOccupancyTypeFields: recordTypes.OccupancyTypeField[] | undefined;

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

export function getOccupancyTypeById(occupancyTypeId: number) {
    const cachedOccupancyTypes = getOccupancyTypes();

    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyTypeId === occupancyTypeId;
    });
}

export function getOccupancyTypeByOccupancyType(occupancyTypeString: string) {
    const cachedOccupancyTypes = getOccupancyTypes();

    const occupancyTypeLowerCase = occupancyTypeString.toLowerCase();

    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyType.toLowerCase() === occupancyTypeLowerCase;
    });
}

export function getOccupancyTypePrintsById(occupancyTypeId: number): string[] {
    const occupancyType = getOccupancyTypeById(occupancyTypeId);

    if (!occupancyType || occupancyType.occupancyTypePrints.length === 0) {
        return [];
    }

    if (occupancyType.occupancyTypePrints.includes("*")) {
        return configFunctions.getProperty("settings.lotOccupancy.prints");
    }

    return occupancyType.occupancyTypePrints;
}

export function clearOccupancyTypesCache() {
    occupancyTypes = undefined;
    allOccupancyTypeFields = undefined;
}

/*
 * Work Order Types
 */

let workOrderTypes: recordTypes.WorkOrderType[] | undefined;

export function getWorkOrderTypes() {
    if (!workOrderTypes) {
        workOrderTypes = getWorkOrderTypesFromDatabase();
    }

    return workOrderTypes;
}

export function getWorkOrderTypeById(workOrderTypeId: number) {
    const cachedWorkOrderTypes = getWorkOrderTypes();

    return cachedWorkOrderTypes.find((currentWorkOrderType) => {
        return currentWorkOrderType.workOrderTypeId === workOrderTypeId;
    });
}

export function clearWorkOrderTypesCache() {
    workOrderTypes = undefined;
}

/*
 * Work Order Milestone Types
 */

let workOrderMilestoneTypes: recordTypes.WorkOrderMilestoneType[] | undefined;

export function getWorkOrderMilestoneTypes() {
    if (!workOrderMilestoneTypes) {
        workOrderMilestoneTypes = getWorkOrderMilestoneTypesFromDatabase();
    }

    return workOrderMilestoneTypes;
}

export function getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId(
    workOrderMilestoneTypeId: number
) {
    const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return currentWorkOrderMilestoneType.workOrderMilestoneTypeId === workOrderMilestoneTypeId;
    });
}

export function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    workOrderMilestoneTypeString: string
) {
    const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    const workOrderMilestoneTypeLowerCase = workOrderMilestoneTypeString.toLowerCase();

    return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
        return (
            currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
            workOrderMilestoneTypeLowerCase
        );
    });
}

export function clearWorkOrderMilestoneTypesCache() {
    workOrderMilestoneTypes = undefined;
}
