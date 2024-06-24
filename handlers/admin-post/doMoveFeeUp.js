import getFeeCategories from '../../database/getFeeCategories.js';
import { moveFeeUp, moveFeeUpToTop } from '../../database/moveFee.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveFeeUpToTop(request.body.feeId)
        : await moveFeeUp(request.body.feeId);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
