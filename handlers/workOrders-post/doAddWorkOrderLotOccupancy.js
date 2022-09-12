import { addWorkOrderLotOccupancy } from "../../helpers/lotOccupancyDB/addWorkOrderLotOccupancy.js";
import { getLotOccupancies } from "../../helpers/lotOccupancyDB/getLotOccupancies.js";
export const handler = async (request, response) => {
    const success = addWorkOrderLotOccupancy({
        workOrderId: request.body.workOrderId,
        lotOccupancyId: request.body.lotOccupancyId
    }, request.session);
    const workOrderLotOccupancies = getLotOccupancies({
        workOrderId: request.body.workOrderId
    }, {
        limit: -1,
        offset: 0,
        includeOccupants: true
    }).lotOccupancies;
    response.json({
        success,
        workOrderLotOccupancies
    });
};
export default handler;
