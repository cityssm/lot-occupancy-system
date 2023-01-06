import { clearOccupancyTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";
export function updateOccupancyType(occupancyTypeForm, requestSession) {
    const success = updateRecord("OccupancyTypes", occupancyTypeForm.occupancyTypeId, occupancyTypeForm.occupancyType, requestSession);
    clearOccupancyTypesCache();
    return success;
}
export default updateOccupancyType;
