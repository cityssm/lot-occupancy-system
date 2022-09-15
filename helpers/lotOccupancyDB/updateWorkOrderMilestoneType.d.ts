import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderMilestoneTypeForm {
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneType: string;
}
export declare const updateWorkOrderMilestoneType: (workOrderMilestoneTypeForm: UpdateWorkOrderMilestoneTypeForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateWorkOrderMilestoneType;
