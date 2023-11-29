import { addLotOccupancyFee } from '../../helpers/lotOccupancyDB/addLotOccupancyFee.js';
import { getLotOccupancyFees } from '../../helpers/lotOccupancyDB/getLotOccupancyFees.js';
export async function handler(request, response) {
    await addLotOccupancyFee(request.body, request.session.user);
    const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyFees
    });
}
export default handler;
