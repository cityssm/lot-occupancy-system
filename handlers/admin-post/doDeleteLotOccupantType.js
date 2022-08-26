import { deleteLotOccupantType } from "../../helpers/lotOccupancyDB/deleteLotOccupantType.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteLotOccupantType(request.body.lotOccupantTypeId, request.session);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
};
export default handler;
