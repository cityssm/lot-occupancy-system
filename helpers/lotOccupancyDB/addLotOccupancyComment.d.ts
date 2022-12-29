import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyCommentForm {
    lotOccupancyId: string | number;
    lotOccupancyCommentDateString?: string;
    lotOccupancyCommentTimeString?: string;
    lotOccupancyComment: string;
}
export declare function addLotOccupancyComment(commentForm: AddLotOccupancyCommentForm, requestSession: recordTypes.PartialSession): number;
export default addLotOccupancyComment;
