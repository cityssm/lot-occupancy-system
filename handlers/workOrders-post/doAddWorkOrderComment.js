import addWorkOrderComment from '../../database/addWorkOrderComment.js';
import { getWorkOrderComments } from '../../database/getWorkOrderComments.js';
export async function handler(request, response) {
    await addWorkOrderComment(request.body, request.session.user);
    const workOrderComments = await getWorkOrderComments(request.body.workOrderId);
    response.json({
        success: true,
        workOrderComments
    });
}
export default handler;
