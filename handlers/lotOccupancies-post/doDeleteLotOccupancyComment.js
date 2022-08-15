import { deleteLotOccupancyComment } from "../../helpers/lotOccupancyDB/deleteLotOccupancyComment.js";
import { getLotOccupancyComments } from "../../helpers/lotOccupancyDB/getLotOccupancyComments.js";
export const handler = async (request, response) => {
    const success = deleteLotOccupancyComment(request.body.lotOccupancyCommentId, request.session);
    const lotOccupancyComments = getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyComments
    });
};
export default handler;
