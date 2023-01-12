import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export const handler = (request, response) => {
    const success = deleteRecord('FeeCategories', request.body.feeCategoryId, request.session);
    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
};
export default handler;
