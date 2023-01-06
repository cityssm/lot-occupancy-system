import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveLotOccupantTypeUp(lotOccupantTypeId) {
    const success = moveRecordUp("LotOccupantTypes", lotOccupantTypeId);
    return success;
}
export function moveLotOccupantTypeUpToTop(lotOccupantTypeId) {
    const success = moveRecordUpToTop("LotOccupantTypes", lotOccupantTypeId);
    return success;
}
export default moveLotOccupantTypeUp;
