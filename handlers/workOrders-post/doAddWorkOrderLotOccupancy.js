import { addWorkOrderLotOccupancy } from '../../helpers/lotOccupancyDB/addWorkOrderLotOccupancy.js';
import { getLotOccupancies } from '../../helpers/lotOccupancyDB/getLotOccupancies.js';
export async function handler(request, response) {
    const success = addWorkOrderLotOccupancy({
        workOrderId: request.body.workOrderId,
        lotOccupancyId: request.body.lotOccupancyId
    }, request.session);
    const workOrderLotOccupanciesResults = await getLotOccupancies({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0,
        includeOccupants: true
    });
    response.json({
        success,
        workOrderLotOccupancies: workOrderLotOccupanciesResults.lotOccupancies
    });
}
export default handler;
