import { addWorkOrderLot } from '../../helpers/lotOccupancyDB/addWorkOrderLot.js';
import { getLots } from '../../helpers/lotOccupancyDB/getLots.js';
export const handler = (request, response) => {
    const success = addWorkOrderLot({
        workOrderId: request.body.workOrderId,
        lotId: request.body.lotId
    }, request.session);
    const workOrderLots = getLots({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0
    }).lots;
    response.json({
        success,
        workOrderLots
    });
};
export default handler;
