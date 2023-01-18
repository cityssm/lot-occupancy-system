import { updateLotStatus } from '../../helpers/lotOccupancyDB/updateLot.js';
import { getLots } from '../../helpers/lotOccupancyDB/getLots.js';
export async function handler(request, response) {
    const success = updateLotStatus(request.body.lotId, request.body.lotStatusId, request.session);
    const workOrderLotsResults = await getLots({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0
    });
    response.json({
        success,
        workOrderLots: workOrderLotsResults.lots
    });
}
export default handler;
