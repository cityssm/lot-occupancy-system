import { clearOccupancyTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateOccupancyTypeForm {
    occupancyTypeId: number | string;
    occupancyType: string;
}

export function updateOccupancyType(
    occupancyTypeForm: UpdateOccupancyTypeForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "OccupancyTypes",
        occupancyTypeForm.occupancyTypeId,
        occupancyTypeForm.occupancyType,
        requestSession
    );

    clearOccupancyTypesCache();

    return success;
}

export default updateOccupancyType;
