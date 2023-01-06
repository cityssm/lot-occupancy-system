import { clearWorkOrderTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateWorkOrderTypeForm {
    workOrderTypeId: number | string;
    workOrderType: string;
}

export function updateWorkOrderType(
    workOrderTypeForm: UpdateWorkOrderTypeForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "WorkOrderTypes",
        workOrderTypeForm.workOrderTypeId,
        workOrderTypeForm.workOrderType,
        requestSession
    );

    clearWorkOrderTypesCache();

    return success;
}

export default updateWorkOrderType;
