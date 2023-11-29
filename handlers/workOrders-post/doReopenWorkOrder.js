import { reopenWorkOrder } from '../../database/reopenWorkOrder.js';
export async function handler(request, response) {
    const success = await reopenWorkOrder(request.body.workOrderId, request.session.user);
    response.json({
        success,
        workOrderId: request.body.workOrderId
    });
}
export default handler;
