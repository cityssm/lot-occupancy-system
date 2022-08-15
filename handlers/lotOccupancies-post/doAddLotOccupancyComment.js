import { addLotOccupancyComment } from "../../helpers/lotOccupancyDB/addLotOccupancyComment.js";
import { getLotOccupancyComments } from "../../helpers/lotOccupancyDB/getLotOccupancyComments.js";
export const handler = async (request, response) => {
    addLotOccupancyComment(request.body, request.session);
    const lotOccupancyComments = getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyComments
    });
};
export default handler;
