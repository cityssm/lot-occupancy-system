import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveLotStatusDown(lotStatusId: number | string): boolean {
    const success = moveRecordDown("LotStatuses", lotStatusId);
    return success;
}

export function moveLotStatusDownToBottom(lotStatusId: number | string): boolean {
    const success = moveRecordDownToBottom("LotStatuses", lotStatusId);
    return success;
}

export default moveLotStatusDown;
