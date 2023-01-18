import type * as recordTypes from '../../types/recordTypes';
interface AddLotCommentForm {
    lotId: string;
    lotComment: string;
}
export declare function addLotComment(lotCommentForm: AddLotCommentForm, requestSession: recordTypes.PartialSession): Promise<number>;
export default addLotComment;
