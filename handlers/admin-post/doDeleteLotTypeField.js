import { deleteLotTypeField } from "../../helpers/lotOccupancyDB/deleteLotTypeField.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteLotTypeField(request.body.lotTypeFieldId, request.session);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
