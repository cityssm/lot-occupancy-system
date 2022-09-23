import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderCommentForm {
    workOrderCommentId: string | number;
    workOrderCommentDateString: string;
    workOrderCommentTimeString: string;
    workOrderComment: string;
}
export declare const updateWorkOrderComment: (commentForm: UpdateWorkOrderCommentForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateWorkOrderComment;
