import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveLotOccupantTypeUp(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordUp("LotOccupantTypes", lotOccupantTypeId);
    return success;
}

export function moveLotOccupantTypeUpToTop(lotOccupantTypeId: number | string): boolean {
    const success = moveRecordUpToTop("LotOccupantTypes", lotOccupantTypeId);
    return success;
}

export default moveLotOccupantTypeUp;
