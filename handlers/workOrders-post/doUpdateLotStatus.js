import { updateLotStatus } from "../../helpers/lotOccupancyDB/updateLot.js";
import { getLots } from "../../helpers/lotOccupancyDB/getLots.js";
export const handler = async (request, response) => {
    const success = updateLotStatus(request.body.lotId, request.body.lotStatusId, request.session);
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
