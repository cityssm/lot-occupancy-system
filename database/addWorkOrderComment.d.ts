interface AddWorkOrderCommentForm {
    workOrderId: string;
    workOrderComment: string;
}
export declare function addWorkOrderComment(workOrderCommentForm: AddWorkOrderCommentForm, user: User): Promise<number>;
export default addWorkOrderComment;
