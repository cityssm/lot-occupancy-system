import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveWorkOrderMilestoneTypeUp(workOrderMilestoneTypeId) {
    const success = moveRecordUp("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}
export function moveWorkOrderMilestoneTypeUpToTop(workOrderMilestoneTypeId) {
    const success = moveRecordUpToTop("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}
export default moveWorkOrderMilestoneTypeUp;
