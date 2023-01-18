import { moveFeeUp, moveFeeUpToTop } from '../../helpers/lotOccupancyDB/moveFee.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export async function handler(request, response) {
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
export default handler;
