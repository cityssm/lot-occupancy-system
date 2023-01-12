import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export const handler = (request, response) => {
    const feeCategoryId = addRecord('FeeCategories', request.body.feeCategory, request.body.orderNumber ?? -1, request.session);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success: true,
        feeCategoryId,
        feeCategories
    });
};
export default handler;
