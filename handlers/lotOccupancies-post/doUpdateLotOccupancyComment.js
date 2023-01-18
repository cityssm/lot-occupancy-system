import { updateLotOccupancyComment } from '../../helpers/lotOccupancyDB/updateLotOccupancyComment.js';
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js';
export async function handler(request, response) {
    const success = await updateLotOccupancyComment(request.body, request.session);
    const lotOccupancyComments = await getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyComments
    });
}
export default handler;
