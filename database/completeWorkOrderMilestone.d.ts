export interface CompleteWorkOrderMilestoneForm {
    workOrderMilestoneId: string | number;
    workOrderMilestoneCompletionDateString?: string;
    workOrderMilestoneCompletionTimeString?: string;
}
export default function completeWorkOrderMilestone(milestoneForm: CompleteWorkOrderMilestoneForm, user: User): Promise<boolean>;
