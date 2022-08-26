import { moveLotOccupantTypeUp } from "../../helpers/lotOccupancyDB/moveLotOccupantTypeUp.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveLotOccupantTypeUp(request.body.lotOccupantTypeId);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
};
export default handler;
