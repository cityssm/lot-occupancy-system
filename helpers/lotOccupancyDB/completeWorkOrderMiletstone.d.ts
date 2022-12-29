import type * as recordTypes from "../../types/recordTypes";
interface CompleteWorkOrderMilestoneForm {
    workOrderMilestoneId: string | number;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export declare function completeWorkOrderMilestone(milestoneForm: CompleteWorkOrderMilestoneForm, requestSession: recordTypes.PartialSession): boolean;
export default completeWorkOrderMilestone;
