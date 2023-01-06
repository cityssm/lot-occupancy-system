import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveLotOccupantTypeDown(lotOccupantTypeId) {
    const success = moveRecordDown("LotOccupantTypes", lotOccupantTypeId);
    return success;
}
export function moveLotOccupantTypeDownToBottom(lotOccupantTypeId) {
    const success = moveRecordDownToBottom("LotOccupantTypes", lotOccupantTypeId);
    return success;
}
export default moveLotOccupantTypeDown;
