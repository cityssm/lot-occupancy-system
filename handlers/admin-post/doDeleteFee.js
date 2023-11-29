import { deleteRecord } from '../../database/deleteRecord.js';
import { getFeeCategories } from '../../database/getFeeCategories.js';
export async function handler(request, response) {
    const success = await deleteRecord('Fees', request.body.feeId, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
export default handler;
