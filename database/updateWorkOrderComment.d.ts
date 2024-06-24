import { type DateString, type TimeString } from '@cityssm/utils-datetime';
export interface UpdateWorkOrderCommentForm {
    workOrderCommentId: string | number;
    workOrderCommentDateString: DateString;
    workOrderCommentTimeString: TimeString;
    workOrderComment: string;
}
export default function updateWorkOrderComment(commentForm: UpdateWorkOrderCommentForm, user: User): Promise<boolean>;
