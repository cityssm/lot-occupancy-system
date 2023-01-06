import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotStatusUp(lotStatusId) {
    const success = moveRecordUp("LotStatuses", lotStatusId);
    return success;
}
export function moveLotStatusUpToTop(lotStatusId) {
    const success = moveRecordUpToTop("LotStatuses", lotStatusId);
    return success;
}
export default moveLotStatusUp;
