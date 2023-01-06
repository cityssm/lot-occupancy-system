import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";
export function addWorkOrderType(workOrderTypeForm, requestSession) {
    const workOrderTypeId = addRecord("WorkOrderTypes", workOrderTypeForm.workOrderType, workOrderTypeForm.orderNumber || -1, requestSession);
    clearWorkOrderTypesCache();
    return workOrderTypeId;
}
export default addWorkOrderType;
