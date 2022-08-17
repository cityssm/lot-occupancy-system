import { deleteFee } from "../../helpers/lotOccupancyDB/deleteFee.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";
export const handler = async (request, response) => {
    const success = deleteFee(request.body.feeId, request.session);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
