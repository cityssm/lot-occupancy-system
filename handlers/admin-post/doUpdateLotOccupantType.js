import { updateLotOccupantType } from "../../helpers/lotOccupancyDB/updateLotOccupantType.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateLotOccupantType(request.body, request.session);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
};
export default handler;