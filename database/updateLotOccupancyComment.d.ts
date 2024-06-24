import { type DateString, type TimeString } from '@cityssm/utils-datetime';
export interface UpdateLotOccupancyCommentForm {
    lotOccupancyCommentId: string | number;
    lotOccupancyCommentDateString: DateString;
    lotOccupancyCommentTimeString: TimeString;
    lotOccupancyComment: string;
}
export default function updateLotOccupancyComment(commentForm: UpdateLotOccupancyCommentForm, user: User): Promise<boolean>;
