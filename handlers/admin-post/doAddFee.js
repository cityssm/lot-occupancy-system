import { addFee } from '../../helpers/lotOccupancyDB/addFee.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export async function handler(request, response) {
    const feeId = await addFee(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success: true,
        feeId,
        feeCategories
    });
}
export default handler;
