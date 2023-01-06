import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";
export function updateWorkOrderMilestoneType(workOrderMilestoneTypeForm, requestSession) {
    const success = updateRecord("WorkOrderMilestoneTypes", workOrderMilestoneTypeForm.workOrderMilestoneTypeId, workOrderMilestoneTypeForm.workOrderMilestoneType, requestSession);
    clearWorkOrderMilestoneTypesCache();
    return success;
}
export default updateWorkOrderMilestoneType;
