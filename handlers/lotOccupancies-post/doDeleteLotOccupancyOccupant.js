import { deleteLotOccupancyOccupant } from "../../helpers/lotOccupancyDB/deleteLotOccupancyOccupant.js";
import { getLotOccupancyOccupants } from "../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js";
export const handler = async (request, response) => {
    deleteLotOccupancyOccupant(request.body.lotOccupancyId, request.body.lotOccupantIndex, request.session);
    const lotOccupancyOccupants = getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyOccupants
    });
};
export default handler;
