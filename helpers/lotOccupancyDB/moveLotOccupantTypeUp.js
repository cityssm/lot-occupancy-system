import { clearLotOccupantTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotOccupantTypeUp(lotOccupantTypeId) {
    const success = moveRecordUp("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}
export function moveLotOccupantTypeUpToTop(lotOccupantTypeId) {
    const success = moveRecordUpToTop("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}
export default moveLotOccupantTypeUp;
