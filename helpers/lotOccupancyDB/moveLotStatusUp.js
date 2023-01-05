import { clearLotStatusesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotStatusUp(lotStatusId) {
    const success = moveRecordUp("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}
export function moveLotStatusUpToTop(lotStatusId) {
    const success = moveRecordUpToTop("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}
export default moveLotStatusUp;
