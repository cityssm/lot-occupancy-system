interface UpdateWorkOrderMilestoneForm {
    workOrderMilestoneId: string | number;
    workOrderMilestoneTypeId: number | string;
    workOrderMilestoneDateString: string;
    workOrderMilestoneTimeString?: string;
    workOrderMilestoneDescription: string;
}
export declare function updateWorkOrderMilestone(milestoneForm: UpdateWorkOrderMilestoneForm, user: User): Promise<boolean>;
export default updateWorkOrderMilestone;
