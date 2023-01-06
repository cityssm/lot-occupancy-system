import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveLotTypeDown(lotTypeId) {
    const success = moveRecordDown("LotTypes", lotTypeId);
    return success;
}
export function moveLotTypeDownToBottom(lotTypeId) {
    const success = moveRecordDownToBottom("LotTypes", lotTypeId);
    return success;
}
export default moveLotTypeDown;
