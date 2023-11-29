import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotComments } from '../../helpers/lotOccupancyDB/getLotComments.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotComments', request.body.lotCommentId, request.session.user);
    const lotComments = await getLotComments(request.body.lotId);
    response.json({
        success,
        lotComments
    });
}
export default handler;
