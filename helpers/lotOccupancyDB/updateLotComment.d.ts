import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotCommentForm {
    lotCommentId: string | number;
    lotCommentDateString: string;
    lotCommentTimeString: string;
    lotComment: string;
}
export declare const updateLotComment: (commentForm: UpdateLotCommentForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLotComment;
