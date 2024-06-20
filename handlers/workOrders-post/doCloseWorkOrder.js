import closeWorkOrder from '../../database/closeWorkOrder.js';
export async function handler(request, response) {
    const success = await closeWorkOrder(request.body, request.session.user);
    response.json({
        success
    });
}
export default handler;
