import { updateWorkOrder } from '../../helpers/lotOccupancyDB/updateWorkOrder.js';
export async function handler(request, response) {
    const success = await updateWorkOrder(request.body, request.session);
    response.json({
        success,
        workOrderId: request.body.workOrderId
    });
}
export default handler;
