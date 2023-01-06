import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";
export function updateWorkOrderType(workOrderTypeForm, requestSession) {
    const success = updateRecord("WorkOrderTypes", workOrderTypeForm.workOrderTypeId, workOrderTypeForm.workOrderType, requestSession);
    clearWorkOrderTypesCache();
    return success;
}
export default updateWorkOrderType;
