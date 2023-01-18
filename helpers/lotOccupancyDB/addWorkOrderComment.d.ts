import type * as recordTypes from '../../types/recordTypes';
interface AddWorkOrderCommentForm {
    workOrderId: string;
    workOrderComment: string;
}
export declare function addWorkOrderComment(workOrderCommentForm: AddWorkOrderCommentForm, requestSession: recordTypes.PartialSession): Promise<number>;
export default addWorkOrderComment;
