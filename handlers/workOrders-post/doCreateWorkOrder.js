import addWorkOrder from '../../database/addWorkOrder.js';
export default async function handler(request, response) {
    const workOrderId = await addWorkOrder(request.body, request.session.user);
    response.json({
        success: true,
        workOrderId
    });
}
