import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotOccupancyComments } from '../../helpers/lotOccupancyDB/getLotOccupancyComments.js';
export const handler = (request, response) => {
    const success = deleteRecord('LotOccupancyComments', request.body.lotOccupancyCommentId, request.session);
    const lotOccupancyComments = getLotOccupancyComments(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyComments
    });
};
export default handler;
