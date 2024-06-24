export interface UpdateWorkOrderCommentForm {
    workOrderCommentId: string | number;
    workOrderCommentDateString: string;
    workOrderCommentTimeString: string;
    workOrderComment: string;
}
export declare function updateWorkOrderComment(commentForm: UpdateWorkOrderCommentForm, user: User): Promise<boolean>;
export default updateWorkOrderComment;
