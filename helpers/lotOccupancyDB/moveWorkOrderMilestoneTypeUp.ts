import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveWorkOrderMilestoneTypeUp(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordUp("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}

export function moveWorkOrderMilestoneTypeUpToTop(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordUpToTop("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}

export default moveWorkOrderMilestoneTypeUp;
