import { clearLotOccupantTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveLotOccupantTypeDown(lotOccupantTypeId) {
    const success = moveRecordDown("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}
export function moveLotOccupantTypeDownToBottom(lotOccupantTypeId) {
    const success = moveRecordDownToBottom("LotOccupantTypes", lotOccupantTypeId);
    clearLotOccupantTypesCache();
    return success;
}
export default moveLotOccupantTypeDown;
