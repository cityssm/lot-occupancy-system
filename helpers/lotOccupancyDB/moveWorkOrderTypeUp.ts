import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveWorkOrderTypeUp(workOrderTypeId: number | string): boolean {
    const success = moveRecordUp("WorkOrderTypes", workOrderTypeId);
    return success;
}

export function moveWorkOrderTypeUpToTop(workOrderTypeId: number | string): boolean {
    const success = moveRecordUpToTop("WorkOrderTypes", workOrderTypeId);
    return success;
}

export default moveWorkOrderTypeUp;
