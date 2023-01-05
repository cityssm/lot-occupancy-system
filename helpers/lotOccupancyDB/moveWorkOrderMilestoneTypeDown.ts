import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";

import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveWorkOrderMilestoneTypeDown(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordDown("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    clearWorkOrderMilestoneTypesCache();
    return success;
}

export function moveWorkOrderMilestoneTypeDownToBottom(workOrderMilestoneTypeId: number | string): boolean {
    const success = moveRecordDownToBottom("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    clearWorkOrderMilestoneTypesCache();
    return success;
}

export default moveWorkOrderMilestoneTypeDown;
