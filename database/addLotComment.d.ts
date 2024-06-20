export interface AddLotCommentForm {
    lotId: string;
    lotComment: string;
}
export default function addLotComment(lotCommentForm: AddLotCommentForm, user: User): Promise<number>;
