import { reopenWorkOrder } from '../../helpers/lotOccupancyDB/reopenWorkOrder.js';
export async function handler(request, response) {
    const success = reopenWorkOrder(request.body.workOrderId, request.session);
    response.json({
        success,
        workOrderId: request.body.workOrderId
    });
}
export default handler;
