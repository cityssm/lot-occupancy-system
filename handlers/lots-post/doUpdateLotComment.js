import { updateLotComment } from '../../helpers/lotOccupancyDB/updateLotComment.js';
import { getLotComments } from '../../helpers/lotOccupancyDB/getLotComments.js';
export async function handler(request, response) {
    const success = await updateLotComment(request.body, request.session);
    const lotComments = await getLotComments(request.body.lotId);
    response.json({
        success,
        lotComments
    });
}
export default handler;
