import { updateWorkOrderComment } from '../../helpers/lotOccupancyDB/updateWorkOrderComment.js';
import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js';
export const handler = (request, response) => {
    const success = updateWorkOrderComment(request.body, request.session);
    const workOrderComments = getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
};
export default handler;
