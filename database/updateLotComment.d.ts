import { type DateString, type TimeString } from '@cityssm/utils-datetime';
export interface UpdateLotCommentForm {
    lotCommentId: string | number;
    lotCommentDateString: DateString;
    lotCommentTimeString: TimeString;
    lotComment: string;
}
export default function updateLotComment(commentForm: UpdateLotCommentForm, user: User): Promise<boolean>;
