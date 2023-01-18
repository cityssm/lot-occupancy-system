import type * as recordTypes from '../../types/recordTypes';
interface AddWorkOrderMilestoneForm {
    workOrderId: string | number;
    workOrderMilestoneTypeId?: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export declare function addWorkOrderMilestone(milestoneForm: AddWorkOrderMilestoneForm, requestSession: recordTypes.PartialSession): Promise<number>;
export default addWorkOrderMilestone;
