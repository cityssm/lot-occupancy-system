import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderMilestoneTypeForm {
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneType: string;
}
export declare function updateWorkOrderMilestoneType(workOrderMilestoneTypeForm: UpdateWorkOrderMilestoneTypeForm, requestSession: recordTypes.PartialSession): boolean;
export default updateWorkOrderMilestoneType;
