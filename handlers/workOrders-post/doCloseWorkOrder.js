import closeWorkOrder from '../../database/closeWorkOrder.js';
export default async function handler(request, response) {
    const success = await closeWorkOrder(request.body, request.session.user);
    response.json({
        success
    });
}
