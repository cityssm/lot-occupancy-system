import { addLotOccupancyOccupant } from "../../helpers/lotOccupancyDB/addLotOccupancyOccupant.js";
import { getLotOccupancyOccupants } from "../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js";
export const handler = async (request, response) => {
    addLotOccupancyOccupant(request.body, request.session);
    const lotOccupancyOccupants = getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyOccupants
    });
};
export default handler;
