import { addWorkOrder } from '../../database/addWorkOrder.js';
export async function handler(request, response) {
    const workOrderId = await addWorkOrder(request.body, request.session.user);
    response.json({
        success: true,
        workOrderId
    });
}
export default handler;
