import { clearLotOccupantTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveLotOccupantTypeUp(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordUp("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}

export function moveLotOccupantTypeUpToTop(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordUpToTop("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}

export default moveLotOccupantTypeUp;
