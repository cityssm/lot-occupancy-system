import { updateFee } from "../../helpers/lotOccupancyDB/updateFee.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";
export const handler = async (request, response) => {
    const success = updateFee(request.body, request.session);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
