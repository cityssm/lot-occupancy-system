import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveOccupancyTypeUp(occupancyTypeId) {
    const success = moveRecordUp("OccupancyTypes", occupancyTypeId);
    return success;
}
export function moveOccupancyTypeUpToTop(occupancyTypeId) {
    const success = moveRecordUpToTop("OccupancyTypes", occupancyTypeId);
    return success;
}
export default moveOccupancyTypeUp;
