interface AddWorkOrderMilestoneForm {
    workOrderId: string | number;
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export declare function addWorkOrderMilestone(milestoneForm: AddWorkOrderMilestoneForm, user: User): Promise<number>;
export default addWorkOrderMilestone;
