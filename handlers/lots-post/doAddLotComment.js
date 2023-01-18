import { addLotComment } from '../../helpers/lotOccupancyDB/addLotComment.js';
import { getLotComments } from '../../helpers/lotOccupancyDB/getLotComments.js';
export async function handler(request, response) {
    await addLotComment(request.body, request.session);
    const lotComments = await getLotComments(request.body.lotId);
    response.json({
        success: true,
        lotComments
    });
}
export default handler;
