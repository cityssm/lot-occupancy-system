import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";
export function addWorkOrderMilestoneType(workOrderMilestoneTypeForm, requestSession) {
    const workOrderMilestoneId = addRecord("WorkOrderMilestoneTypes", workOrderMilestoneTypeForm.workOrderMilestoneType, workOrderMilestoneTypeForm.orderNumber || -1, requestSession);
    clearWorkOrderMilestoneTypesCache();
    return workOrderMilestoneId;
}
export default addWorkOrderMilestoneType;
