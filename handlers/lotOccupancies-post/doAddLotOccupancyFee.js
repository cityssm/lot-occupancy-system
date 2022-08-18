import { addLotOccupancyFee } from "../../helpers/lotOccupancyDB/addLotOccupancyFee.js";
import { getLotOccupancyFees } from "../../helpers/lotOccupancyDB/getLotOccupancyFees.js";
export const handler = async (request, response) => {
    addLotOccupancyFee(request.body, request.session);
    const lotOccupancyFees = getLotOccupancyFees(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyFees
    });
};
export default handler;
