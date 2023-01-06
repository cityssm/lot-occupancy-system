import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveWorkOrderMilestoneTypeDown(workOrderMilestoneTypeId) {
    const success = moveRecordDown("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}
export function moveWorkOrderMilestoneTypeDownToBottom(workOrderMilestoneTypeId) {
    const success = moveRecordDownToBottom("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}
export default moveWorkOrderMilestoneTypeDown;
