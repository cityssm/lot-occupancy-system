import { getWorkOrders } from '../../database/getWorkOrders.js';
export async function handler(request, response) {
    const result = await getWorkOrders(request.body, {
        limit: request.body.limit,
        offset: request.body.offset,
        includeLotsAndLotOccupancies: true
    });
    response.json({
        count: result.count,
        offset: Number.parseInt(request.body.offset, 10),
        workOrders: result.workOrders
    });
}
export default handler;
