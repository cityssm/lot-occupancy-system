import { deleteLotType } from "../../helpers/lotOccupancyDB/deleteLotType.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteLotType(request.body.lotTypeId, request.session);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
