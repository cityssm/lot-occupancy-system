import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotOccupancyComments', request.body.lotOccupancyCommentId, request.session.user);
    const lotOccupancyComments = await getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyComments
    });
}
export default handler;
