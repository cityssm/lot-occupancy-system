import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveWorkOrderTypeUp(workOrderTypeId) {
    const success = moveRecordUp("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}
export function moveWorkOrderTypeUpToTop(workOrderTypeId) {
    const success = moveRecordUpToTop("WorkOrderTypes", workOrderTypeId);
    clearWorkOrderTypesCache();
    return success;
}
export default moveWorkOrderTypeUp;
