import { clearLotStatusesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveLotStatusDown(lotStatusId) {
    const success = moveRecordDown("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}
export function moveLotStatusDownToBottom(lotStatusId) {
    const success = moveRecordDownToBottom("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}
export default moveLotStatusDown;
