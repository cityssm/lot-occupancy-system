import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from "./lotOccupancyDB/getLotOccupantTypes.js";
import { getLotStatuses as getLotStatusesFromDatabase } from "./lotOccupancyDB/getLotStatuses.js";
import { getLotTypes as getLotTypesFromDatabase } from "./lotOccupancyDB/getLotTypes.js";
import { getOccupancyTypes as getOccupancyTypesFromDatabase } from "./lotOccupancyDB/getOccupancyTypes.js";

import type * as recordTypes from "../types/recordTypes";

/*
 * Lot Occupant Types
 */

let lotOccupantTypes: recordTypes.LotOccupantType[];

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

export function getLotOccupantTypesByLotOccupantType(lotOccupantType: string) {

    const cachedLotOccupantTypes = getLotOccupantTypes();

    const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase();

    return cachedLotOccupantTypes.find((currentLotOccupantType) => {
        return currentLotOccupantType.lotOccupantType.toLowerCase() === lotOccupantTypeLowerCase;
    });
}


/*
* Lot Statuses
*/

let lotStatuses: recordTypes.LotStatus[];

export function getLotStatuses () {
    
    if (!lotStatuses) {
        lotStatuses = getLotStatusesFromDatabase();
    }
    
    return lotStatuses;
}

export function getLotStatusById (lotStatusId: number) {
    
    const cachedLotStatuses = getLotStatuses();
    
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatusId === lotStatusId;
    });
}

export function getLotStatusByLotStatus (lotStatus: string) {
    
    const cachedLotStatuses = getLotStatuses();
    
    const lotStatusLowerCase = lotStatus.toLowerCase();
    
    return cachedLotStatuses.find((currentLotStatus) => {
        return currentLotStatus.lotStatus.toLowerCase() === lotStatusLowerCase;
    });
}

/*
 * Lot Types
 */

let lotTypes: recordTypes.LotType[];

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

/*
* Occupancy Types
*/

let occupancyTypes: recordTypes.OccupancyType[];

export function getOccupancyTypes () {

    if (!occupancyTypes) {
        occupancyTypes = getOccupancyTypesFromDatabase();
    }

    return occupancyTypes;
}

export function getOccupancyTypeById (occupancyTypeId: number) {

    const cachedOccupancyTypes = getOccupancyTypes();

    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyTypeId === occupancyTypeId;
    });
}

export function getOccupancyTypeByOccupancyType (occupancyType: string) {
    
    const cachedOccupancyTypes = getOccupancyTypes();

    const occupancyTypeLowerCase = occupancyType.toLowerCase();

    return cachedOccupancyTypes.find((currentOccupancyType) => {
        return currentOccupancyType.occupancyType.toLowerCase() === occupancyTypeLowerCase;
    });
}