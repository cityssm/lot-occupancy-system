import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveRecordUpToTop("LotTypes", request.body.lotTypeId)
        : moveRecordUp("LotTypes", request.body.lotTypeId);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
