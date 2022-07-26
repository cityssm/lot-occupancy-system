import type * as recordTypes from "../../types/recordTypes";
interface AddLotCommentForm {
    lotId: string;
    lotComment: string;
}
export declare const addLotComment: (lotCommentForm: AddLotCommentForm, requestSession: recordTypes.PartialSession) => number;
export default addLotComment;
