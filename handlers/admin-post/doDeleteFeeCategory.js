import { deleteFeeCategory } from "../../helpers/lotOccupancyDB/deleteFeeCategory.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";
export const handler = async (request, response) => {
    const success = deleteFeeCategory(request.body.feeCategoryId, request.session);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
