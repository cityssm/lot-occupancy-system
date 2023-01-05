import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveWorkOrderTypeUp(workOrderTypeId: number | string): boolean {
    const success = moveRecordUp("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}

export function moveWorkOrderTypeUpToTop(workOrderTypeId: number | string): boolean {
    const success = moveRecordUpToTop("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}

export default moveWorkOrderTypeUp;
