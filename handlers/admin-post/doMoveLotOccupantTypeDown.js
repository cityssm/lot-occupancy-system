import { moveLotOccupantTypeDown, moveLotOccupantTypeDownToBottom } from "../../helpers/lotOccupancyDB/moveLotOccupantTypeDown.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveLotOccupantTypeDownToBottom(request.body.lotOccupantTypeId)
        : moveLotOccupantTypeDown(request.body.lotOccupantTypeId);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
};
export default handler;
