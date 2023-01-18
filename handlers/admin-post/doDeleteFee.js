import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export async function handler(request, response) {
    const success = await deleteRecord('Fees', request.body.feeId, request.session);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
export default handler;
