interface UpdateLotOccupancyCommentForm {
    lotOccupancyCommentId: string | number;
    lotOccupancyCommentDateString: string;
    lotOccupancyCommentTimeString: string;
    lotOccupancyComment: string;
}
export declare function updateLotOccupancyComment(commentForm: UpdateLotOccupancyCommentForm, user: User): Promise<boolean>;
export default updateLotOccupancyComment;
