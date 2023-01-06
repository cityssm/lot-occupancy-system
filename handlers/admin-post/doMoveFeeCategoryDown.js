import { moveRecordDown, moveRecordDownToBottom } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveRecordDownToBottom("FeeCategories", request.body.feeCategoryId)
        : moveRecordDown("FeeCategories", request.body.feeCategoryId);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
