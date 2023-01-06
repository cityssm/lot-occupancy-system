import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveOccupancyTypeUp(occupancyTypeId: number | string): boolean {
    const success = moveRecordUp("OccupancyTypes", occupancyTypeId);
    return success;
}

export function moveOccupancyTypeUpToTop(occupancyTypeId: number | string): boolean {
    const success = moveRecordUpToTop("OccupancyTypes", occupancyTypeId);
    return success;
}

export default moveOccupancyTypeUp;
