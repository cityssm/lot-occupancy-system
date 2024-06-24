import { deleteRecord } from '../../database/deleteRecord.js';
export default async function handler(request, response) {
    const success = await deleteRecord('WorkOrders', request.body.workOrderId, request.session.user);
    response.json({
        success
    });
}
