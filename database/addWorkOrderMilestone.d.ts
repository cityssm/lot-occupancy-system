export interface AddWorkOrderMilestoneForm {
    workOrderId: string | number;
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export default function addWorkOrderMilestone(milestoneForm: AddWorkOrderMilestoneForm, user: User): Promise<number>;
