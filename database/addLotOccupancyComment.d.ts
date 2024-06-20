export interface AddLotOccupancyCommentForm {
    lotOccupancyId: string | number;
    lotOccupancyCommentDateString?: string;
    lotOccupancyCommentTimeString?: string;
    lotOccupancyComment: string;
}
export default function addLotOccupancyComment(commentForm: AddLotOccupancyCommentForm, user: User): Promise<number>;
