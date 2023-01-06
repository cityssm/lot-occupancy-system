import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveWorkOrderTypeUp(workOrderTypeId) {
    const success = moveRecordUp("WorkOrderTypes", workOrderTypeId);
    return success;
}
export function moveWorkOrderTypeUpToTop(workOrderTypeId) {
    const success = moveRecordUpToTop("WorkOrderTypes", workOrderTypeId);
    return success;
}
export default moveWorkOrderTypeUp;
