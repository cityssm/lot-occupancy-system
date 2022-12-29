import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderMilestoneTypeForm {
    workOrderMilestoneType: string;
    orderNumber?: number;
}
export declare function addWorkOrderMilestoneType(workOrderMilestoneTypeForm: AddWorkOrderMilestoneTypeForm, requestSession: recordTypes.PartialSession): number;
export default addWorkOrderMilestoneType;
