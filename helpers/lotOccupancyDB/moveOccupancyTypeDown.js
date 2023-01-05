import { clearOccupancyTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveOccupancyTypeDown(occupancyTypeId) {
    const success = moveRecordDown("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}
export function moveOccupancyTypeDownToBottom(occupancyTypeId) {
    const success = moveRecordDownToBottom("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}
export default moveOccupancyTypeDown;
