import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getWorkOrderComments } from '../../helpers/lotOccupancyDB/getWorkOrderComments.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderComments', request.body.workOrderCommentId, request.session.user);
    const workOrderComments = await getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
}
export default handler;
