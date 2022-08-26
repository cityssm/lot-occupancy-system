import { deleteLotComment } from "../../helpers/lotOccupancyDB/deleteLotComment.js";
import { getLotComments } from "../../helpers/lotOccupancyDB/getLotComments.js";
export const handler = async (request, response) => {
    const success = deleteLotComment(request.body.lotCommentId, request.session);
    const lotComments = getLotComments(request.body.lotId);
    response.json({
        success,
        lotComments
    });
};
export default handler;