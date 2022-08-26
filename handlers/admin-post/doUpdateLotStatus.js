import { updateLotStatus } from "../../helpers/lotOccupancyDB/updateLotStatus.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateLotStatus(request.body, request.session);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
