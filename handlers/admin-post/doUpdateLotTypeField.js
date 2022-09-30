import { updateLotTypeField } from "../../helpers/lotOccupancyDB/updateLotTypeField.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateLotTypeField(request.body, request.session);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
