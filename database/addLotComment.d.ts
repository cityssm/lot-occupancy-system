interface AddLotCommentForm {
    lotId: string;
    lotComment: string;
}
export declare function addLotComment(lotCommentForm: AddLotCommentForm, user: User): Promise<number>;
export default addLotComment;
