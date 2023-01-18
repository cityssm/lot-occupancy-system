import { closeWorkOrder } from '../../helpers/lotOccupancyDB/closeWorkOrder.js';
export async function handler(request, response) {
    const success = closeWorkOrder(request.body, request.session);
    response.json({
        success
    });
}
export default handler;
