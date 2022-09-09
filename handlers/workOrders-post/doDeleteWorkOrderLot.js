import { deleteWorkOrderLot } from "../../helpers/lotOccupancyDB/deleteWorkOrderLot.js";
import { getLots } from "../../helpers/lotOccupancyDB/getLots.js";
export const handler = async (request, response) => {
    const success = deleteWorkOrderLot(request.body.workOrderId, request.body.lotId, request.session);
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
