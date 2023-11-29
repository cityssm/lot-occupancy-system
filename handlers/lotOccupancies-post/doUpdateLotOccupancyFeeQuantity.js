import { getLotOccupancyFees } from '../../helpers/lotOccupancyDB/getLotOccupancyFees.js';
import { updateLotOccupancyFeeQuantity } from '../../helpers/lotOccupancyDB/updateLotOccupancyFeeQuantity.js';
export async function handler(request, response) {
    const success = await updateLotOccupancyFeeQuantity(request.body, request.session.user);
    const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyFees
    });
}
export default handler;
