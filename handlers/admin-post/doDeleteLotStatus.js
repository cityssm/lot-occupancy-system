import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteRecord("LotStatuses", request.body.lotStatusId, request.session);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
