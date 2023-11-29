import { getLotComments } from '../../helpers/lotOccupancyDB/getLotComments.js';
import { updateLotComment } from '../../helpers/lotOccupancyDB/updateLotComment.js';
export async function handler(request, response) {
    const success = await updateLotComment(request.body, request.session.user);
    const lotComments = await getLotComments(request.body.lotId);
    response.json({
        success,
        lotComments
    });
}
export default handler;
