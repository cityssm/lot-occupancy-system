import { getLotOccupancy } from '../../database/getLotOccupancy.js';
import { getFeeCategories } from '../../database/getFeeCategories.js';
export async function handler(request, response) {
    const lotOccupancyId = request.body.lotOccupancyId;
    const lotOccupancy = (await getLotOccupancy(lotOccupancyId));
    const feeCategories = await getFeeCategories({
        occupancyTypeId: lotOccupancy.occupancyTypeId,
        lotTypeId: lotOccupancy.lotTypeId
    }, {
        includeFees: true
    });
    response.json({
        feeCategories
    });
}
export default handler;
