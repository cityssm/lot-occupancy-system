import { updateWorkOrderComment } from '../../helpers/lotOccupancyDB/updateWorkOrderComment.js';
import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js';
export async function handler(request, response) {
    const success = await updateWorkOrderComment(request.body, request.session);
    const workOrderComments = await getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
}
export default handler;
