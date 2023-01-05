import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveWorkOrderTypeDown(workOrderTypeId) {
    const success = moveRecordDown("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}
export function moveWorkOrderTypeDownToBottom(workOrderTypeId) {
    const success = moveRecordDownToBottom("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}
export default moveWorkOrderTypeDown;
