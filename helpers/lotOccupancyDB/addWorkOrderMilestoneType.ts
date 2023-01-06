import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";
import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderMilestoneTypeForm {
    workOrderMilestoneType: string;
    orderNumber?: number;
}

export function addWorkOrderMilestoneType(
    workOrderMilestoneTypeForm: AddWorkOrderMilestoneTypeForm,
    requestSession: recordTypes.PartialSession
): number {
    const workOrderMilestoneId = addRecord(
        "WorkOrderMilestoneTypes",
        workOrderMilestoneTypeForm.workOrderMilestoneType,
        workOrderMilestoneTypeForm.orderNumber || -1,
        requestSession
    );

    clearWorkOrderMilestoneTypesCache();

    return workOrderMilestoneId;
}

export default addWorkOrderMilestoneType;
