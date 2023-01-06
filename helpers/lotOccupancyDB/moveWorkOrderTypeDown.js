import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveWorkOrderTypeDown(workOrderTypeId) {
    const success = moveRecordDown("WorkOrderTypes", workOrderTypeId);
    return success;
}
export function moveWorkOrderTypeDownToBottom(workOrderTypeId) {
    const success = moveRecordDownToBottom("WorkOrderTypes", workOrderTypeId);
    return success;
}
export default moveWorkOrderTypeDown;
