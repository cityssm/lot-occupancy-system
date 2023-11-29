interface AddLotOccupancyCommentForm {
    lotOccupancyId: string | number;
    lotOccupancyCommentDateString?: string;
    lotOccupancyCommentTimeString?: string;
    lotOccupancyComment: string;
}
export declare function addLotOccupancyComment(commentForm: AddLotOccupancyCommentForm, user: User): Promise<number>;
export default addLotOccupancyComment;
