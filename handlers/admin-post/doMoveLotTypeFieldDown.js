import { moveLotTypeFieldDown, moveLotTypeFieldDownToBottom } from "../../helpers/lotOccupancyDB/moveLotTypeField.js";
import { getLotTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveLotTypeFieldDownToBottom(request.body.lotTypeFieldId)
        : moveLotTypeFieldDown(request.body.lotTypeFieldId);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
