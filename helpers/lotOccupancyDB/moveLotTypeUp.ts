import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveLotTypeUp(lotTypeId: number | string): boolean {
    const success = moveRecordUp("LotTypes", lotTypeId);
    return success;
}

export function moveLotTypeUpToTop(lotTypeId: number | string): boolean {
    const success = moveRecordUpToTop("LotTypes", lotTypeId);
    return success;
}

export default moveLotTypeUp;
