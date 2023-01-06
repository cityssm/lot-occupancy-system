import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveRecordUpToTop("LotStatuses", request.body.lotStatusId)
        : moveRecordUp("LotStatuses", request.body.lotStatusId);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
