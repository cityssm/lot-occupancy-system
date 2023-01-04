import { moveLotStatusUp, moveLotStatusUpToTop } from "../../helpers/lotOccupancyDB/moveLotStatusUp.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveLotStatusUpToTop(request.body.lotStatusId)
        : moveLotStatusUp(request.body.lotStatusId);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
