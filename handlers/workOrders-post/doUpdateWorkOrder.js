import { updateWorkOrder } from '../../database/updateWorkOrder.js';
export async function handler(request, response) {
    const success = await updateWorkOrder(request.body, request.session.user);
    response.json({
        success,
        workOrderId: request.body.workOrderId
    });
}
export default handler;
