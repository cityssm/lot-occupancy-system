import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
import { updateFee } from '../../helpers/lotOccupancyDB/updateFee.js';
export async function handler(request, response) {
    const success = await updateFee(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
export default handler;
