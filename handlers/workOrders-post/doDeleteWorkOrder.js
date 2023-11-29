import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrders', request.body.workOrderId, request.session.user);
    response.json({
        success
    });
}
export default handler;
