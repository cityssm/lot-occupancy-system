interface CompleteWorkOrderMilestoneForm {
    workOrderMilestoneId: string | number;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export declare function completeWorkOrderMilestone(milestoneForm: CompleteWorkOrderMilestoneForm, user: User): Promise<boolean>;
export default completeWorkOrderMilestone;
