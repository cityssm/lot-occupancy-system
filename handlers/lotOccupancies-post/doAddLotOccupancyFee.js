import { addLotOccupancyFee } from '../../database/addLotOccupancyFee.js';
import { getLotOccupancyFees } from '../../database/getLotOccupancyFees.js';
export async function handler(request, response) {
    await addLotOccupancyFee(request.body, request.session.user);
    const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyFees
    });
}
export default handler;
