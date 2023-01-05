import { clearLotStatusesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveLotStatusUp(lotStatusId: number | string): boolean {
    const success = moveRecordUp("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}

export function moveLotStatusUpToTop(lotStatusId: number | string): boolean {
    const success = moveRecordUpToTop("LotStatuses", lotStatusId);
    clearLotStatusesCache();
    return success;
}

export default moveLotStatusUp;
