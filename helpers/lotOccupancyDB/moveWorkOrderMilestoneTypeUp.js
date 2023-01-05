import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveWorkOrderMilestoneTypeUp(workOrderMilestoneTypeId) {
    const success = moveRecordUp("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    clearWorkOrderMilestoneTypesCache();
    return success;
}
export function moveWorkOrderMilestoneTypeUpToTop(workOrderMilestoneTypeId) {
    const success = moveRecordUpToTop("WorkOrderMilestoneTypes", workOrderMilestoneTypeId);
    clearWorkOrderMilestoneTypesCache();
    return success;
}
export default moveWorkOrderMilestoneTypeUp;
