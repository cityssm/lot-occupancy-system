interface UpdateLotCommentForm {
    lotCommentId: string | number;
    lotCommentDateString: string;
    lotCommentTimeString: string;
    lotComment: string;
}
export declare function updateLotComment(commentForm: UpdateLotCommentForm, user: User): Promise<boolean>;
export default updateLotComment;
