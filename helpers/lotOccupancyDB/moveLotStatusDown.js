import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveLotStatusDown(lotStatusId) {
    const success = moveRecordDown("LotStatuses", lotStatusId);
    return success;
}
export function moveLotStatusDownToBottom(lotStatusId) {
    const success = moveRecordDownToBottom("LotStatuses", lotStatusId);
    return success;
}
export default moveLotStatusDown;
