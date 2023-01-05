import { clearLotTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotTypeUp(lotTypeId) {
    const success = moveRecordUp("LotTypes", lotTypeId);
    clearLotTypesCache();
    return success;
}
export function moveLotTypeUpToTop(lotTypeId) {
    const success = moveRecordUpToTop("LotTypes", lotTypeId);
    clearLotTypesCache();
    return success;
}
export default moveLotTypeUp;
