import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderCommentForm {
    workOrderId: string;
    workOrderComment: string;
}
export declare const addWorkOrderComment: (workOrderCommentForm: AddWorkOrderCommentForm, requestSession: recordTypes.PartialSession) => number;
export default addWorkOrderComment;
