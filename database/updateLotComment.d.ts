import { type DateString, type TimeString } from '@cityssm/utils-datetime';
interface UpdateLotCommentForm {
    lotCommentId: string | number;
    lotCommentDateString: DateString;
    lotCommentTimeString: TimeString;
    lotComment: string;
}
export declare function updateLotComment(commentForm: UpdateLotCommentForm, user: User): Promise<boolean>;
export default updateLotComment;
