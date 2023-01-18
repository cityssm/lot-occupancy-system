import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = deleteRecord('WorkOrders', request.body.workOrderId, request.session);
    response.json({
        success
    });
}
export default handler;
