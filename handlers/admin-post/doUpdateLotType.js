import { updateRecord } from "../../helpers/lotOccupancyDB/updateRecord.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateRecord("LotTypes", request.body.lotTypeId, request.body.lotType, request.session);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
