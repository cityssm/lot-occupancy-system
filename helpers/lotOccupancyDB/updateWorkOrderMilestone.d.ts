import type * as recordTypes from '../../types/recordTypes';
interface UpdateWorkOrderMilestoneForm {
    workOrderMilestoneId: string | number;
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
}
export declare function updateWorkOrderMilestone(milestoneForm: UpdateWorkOrderMilestoneForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateWorkOrderMilestone;
