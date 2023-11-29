import { deleteRecord } from '../../database/deleteRecord.js';
import { getWorkOrderComments } from '../../database/getWorkOrderComments.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderComments', request.body.workOrderCommentId, request.session.user);
    const workOrderComments = await getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
}
export default handler;
