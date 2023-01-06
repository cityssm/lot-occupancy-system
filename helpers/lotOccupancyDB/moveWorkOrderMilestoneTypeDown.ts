import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveWorkOrderMilestoneTypeDown(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordDown("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}

export function moveWorkOrderMilestoneTypeDownToBottom(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    return success;
}

export default moveWorkOrderMilestoneTypeDown;
