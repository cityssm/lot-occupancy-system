import deleteWorkOrderLotOccupancy from '../../database/deleteWorkOrderLotOccupancy.js';
import { getLotOccupancies } from '../../database/getLotOccupancies.js';
export default async function handler(request, response) {
    const success = await deleteWorkOrderLotOccupancy(request.body.workOrderId, request.body.lotOccupancyId, request.session.user);
    const workOrderLotOccupancies = await getLotOccupancies({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0,
        includeOccupants: true,
        includeFees: false,
        includeTransactions: false
    });
    response.json({
        success,
        workOrderLotOccupancies: workOrderLotOccupancies.lotOccupancies
    });
}
