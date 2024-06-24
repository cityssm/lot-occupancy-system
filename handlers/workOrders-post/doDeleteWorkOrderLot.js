import deleteWorkOrderLot from '../../database/deleteWorkOrderLot.js';
import { getLots } from '../../database/getLots.js';
export default async function handler(request, response) {
    const success = await deleteWorkOrderLot(request.body.workOrderId, request.body.lotId, request.session.user);
    const workOrderLotsResults = await getLots({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0,
        includeLotOccupancyCount: false
    });
    response.json({
        success,
        workOrderLots: workOrderLotsResults.lots
    });
}
