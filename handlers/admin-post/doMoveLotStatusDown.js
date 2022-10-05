import { moveLotStatusDown, moveLotStatusDownToBottom } from "../../helpers/lotOccupancyDB/moveLotStatusDown.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToBottom === "1"
        ? moveLotStatusDownToBottom(request.body.lotStatusId)
        : moveLotStatusDown(request.body.lotStatusId);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
