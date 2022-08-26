import { updateLotComment } from "../../helpers/lotOccupancyDB/updateLotComment.js";
import { getLotComments } from "../../helpers/lotOccupancyDB/getLotComments.js";
export const handler = async (request, response) => {
    const success = updateLotComment(request.body, request.session);
    const lotComments = getLotComments(request.body.lotId);
    response.json({
        success,
        lotComments
    });
};
export default handler;