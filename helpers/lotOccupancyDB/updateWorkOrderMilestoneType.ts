import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateWorkOrderMilestoneTypeForm {
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneType: string;
}

export function updateWorkOrderMilestoneType(
    workOrderMilestoneTypeForm: UpdateWorkOrderMilestoneTypeForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "WorkOrderMilestoneTypes",
        workOrderMilestoneTypeForm.workOrderMilestoneTypeId,
        workOrderMilestoneTypeForm.workOrderMilestoneType,
        requestSession
    );

    clearWorkOrderMilestoneTypesCache();

    return success;
}

export default updateWorkOrderMilestoneType;
