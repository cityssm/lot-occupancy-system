import { moveFeeUp, moveFeeUpToTop } from "../../helpers/lotOccupancyDB/moveFeeUp.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveFeeUpToTop(request.body.feeId)
        : moveFeeUp(request.body.feeId);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
