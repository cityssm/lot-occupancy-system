import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderMilestoneForm {
    workOrderId: string | number;
    workOrderMilestoneTypeId?: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export declare const addWorkOrderMilestone: (milestoneForm: AddWorkOrderMilestoneForm, requestSession: recordTypes.PartialSession) => number;
export default addWorkOrderMilestone;
