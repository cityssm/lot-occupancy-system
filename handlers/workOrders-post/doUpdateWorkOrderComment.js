import { getWorkOrderComments } from '../../database/getWorkOrderComments.js';
import { updateWorkOrderComment } from '../../database/updateWorkOrderComment.js';
export async function handler(request, response) {
    const success = await updateWorkOrderComment(request.body, request.session.user);
    const workOrderComments = await getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
}
export default handler;
