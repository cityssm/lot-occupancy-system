import { moveRecordDown, moveRecordDownToBottom } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveRecordDownToBottom("LotStatuses", request.body.lotStatusId)
        : moveRecordDown("LotStatuses", request.body.lotStatusId);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
