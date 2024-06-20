export interface AddWorkOrderCommentForm {
    workOrderId: string;
    workOrderComment: string;
}
export default function addWorkOrderComment(workOrderCommentForm: AddWorkOrderCommentForm, user: User): Promise<number>;
