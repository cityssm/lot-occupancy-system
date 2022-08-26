import { moveLotStatusUp } from "../../helpers/lotOccupancyDB/moveLotStatusUp.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveLotStatusUp(request.body.lotStatusId);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;