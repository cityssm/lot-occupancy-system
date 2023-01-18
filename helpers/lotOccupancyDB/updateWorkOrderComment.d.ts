import type * as recordTypes from '../../types/recordTypes';
interface UpdateWorkOrderCommentForm {
    workOrderCommentId: string | number;
    workOrderCommentDateString: string;
    workOrderCommentTimeString: string;
    workOrderComment: string;
}
export declare function updateWorkOrderComment(commentForm: UpdateWorkOrderCommentForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateWorkOrderComment;
