import { addLotType } from "../../helpers/lotOccupancyDB/addLotType.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const lotTypeId = addLotType(request.body, request.session);
    const lotTypes = getLotTypes();
    response.json({
        success: true,
        lotTypeId,
        lotTypes
    });
};
export default handler;
