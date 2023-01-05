import { clearOccupancyTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveOccupancyTypeUp(occupancyTypeId) {
    const success = moveRecordUp("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}
export function moveOccupancyTypeUpToTop(occupancyTypeId) {
    const success = moveRecordUpToTop("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}
export default moveOccupancyTypeUp;
