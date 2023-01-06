import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderTypeForm {
    workOrderType: string;
    orderNumber?: number;
}

export function addWorkOrderType(
    workOrderTypeForm: AddWorkOrderTypeForm,
    requestSession: recordTypes.PartialSession
): number {
    const workOrderTypeId = addRecord(
        "WorkOrderTypes",
        workOrderTypeForm.workOrderType,
        workOrderTypeForm.orderNumber || -1,
        requestSession
    );

    clearWorkOrderTypesCache();

    return workOrderTypeId;
}

export default addWorkOrderType;
