import { clearOccupancyTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddOccupancyTypeForm {
    occupancyType: string;
    orderNumber?: number;
}

export function addOccupancyType(
    occupancyTypeForm: AddOccupancyTypeForm,
    requestSession: recordTypes.PartialSession
): number {
    const occupancyTypeId = addRecord(
        "OccupancyTypes",
        occupancyTypeForm.occupancyType,
        occupancyTypeForm.orderNumber || -1,
        requestSession
    );

    clearOccupancyTypesCache();

    return occupancyTypeId;
}

export default addOccupancyType;
