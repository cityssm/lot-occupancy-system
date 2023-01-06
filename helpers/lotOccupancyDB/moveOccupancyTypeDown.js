import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveOccupancyTypeDown(occupancyTypeId) {
    const success = moveRecordDown("OccupancyTypes", occupancyTypeId);
    return success;
}
export function moveOccupancyTypeDownToBottom(occupancyTypeId) {
    const success = moveRecordDownToBottom("OccupancyTypes", occupancyTypeId);
    return success;
}
export default moveOccupancyTypeDown;
