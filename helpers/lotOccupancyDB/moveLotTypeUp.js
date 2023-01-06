import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotTypeUp(lotTypeId) {
    const success = moveRecordUp("LotTypes", lotTypeId);
    return success;
}
export function moveLotTypeUpToTop(lotTypeId) {
    const success = moveRecordUpToTop("LotTypes", lotTypeId);
    return success;
}
export default moveLotTypeUp;
