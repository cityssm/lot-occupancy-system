import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveOccupancyTypeDown(occupancyTypeId: number | string): boolean {
    const success = moveRecordDown("OccupancyTypes", occupancyTypeId);
    return success;
}

export function moveOccupancyTypeDownToBottom(occupancyTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("OccupancyTypes", occupancyTypeId);
    return success;
}

export default moveOccupancyTypeDown;
