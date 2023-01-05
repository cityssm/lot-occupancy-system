import { clearLotStatusesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveLotStatusDown(lotStatusId: number | string): boolean {
    const success = moveRecordDown("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}

export function moveLotStatusDownToBottom(lotStatusId: number | string): boolean {
    const success = moveRecordDownToBottom("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}

export default moveLotStatusDown;
