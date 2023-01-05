import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveWorkOrderTypeDown(workOrderTypeId: number | string): boolean {
    const success = moveRecordDown("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}

export function moveWorkOrderTypeDownToBottom(workOrderTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}

export default moveWorkOrderTypeDown;
