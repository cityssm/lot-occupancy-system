import { clearOccupancyTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveOccupancyTypeDown(occupancyTypeId: number | string): boolean {
    const success = moveRecordDown("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}

export function moveOccupancyTypeDownToBottom(occupancyTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("OccupancyTypes", occupancyTypeId);
    clearOccupancyTypesCache();
    return success;
}

export default moveOccupancyTypeDown;
