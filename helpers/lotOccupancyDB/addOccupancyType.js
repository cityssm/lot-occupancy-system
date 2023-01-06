import { clearOccupancyTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";
export function addOccupancyType(occupancyTypeForm, requestSession) {
    const occupancyTypeId = addRecord("OccupancyTypes", occupancyTypeForm.occupancyType, occupancyTypeForm.orderNumber || -1, requestSession);
    clearOccupancyTypesCache();
    return occupancyTypeId;
}
export default addOccupancyType;
