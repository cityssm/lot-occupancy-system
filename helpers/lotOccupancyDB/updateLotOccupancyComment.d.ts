import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotOccupancyCommentForm {
    lotOccupancyCommentId: string | number;
    lotOccupancyCommentDateString: string;
    lotOccupancyCommentTimeString: string;
    lotOccupancyComment: string;
}
export declare const updateLotOccupancyComment: (commentForm: UpdateLotOccupancyCommentForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLotOccupancyComment;