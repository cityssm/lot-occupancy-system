import { addLotOccupantType } from "../../helpers/lotOccupancyDB/addLotOccupantType.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const lotOccupantTypeId = addLotOccupantType(request.body, request.session);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success: true,
        lotOccupantTypeId,
        lotOccupantTypes
    });
};
export default handler;
