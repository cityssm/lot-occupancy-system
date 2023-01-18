import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export async function handler(request, response) {
    const success = await deleteRecord('FeeCategories', request.body.feeCategoryId, request.session);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
export default handler;
