import { addLotOccupancyComment } from '../../helpers/lotOccupancyDB/addLotOccupancyComment.js';
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js';
export async function handler(request, response) {
    await addLotOccupancyComment(request.body, request.session);
    const lotOccupancyComments = await getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyComments
    });
}
export default handler;
