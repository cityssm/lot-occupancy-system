import addLotOccupancyOccupant from '../../database/addLotOccupancyOccupant.js';
import { getLotOccupancyOccupants } from '../../database/getLotOccupancyOccupants.js';
export async function handler(request, response) {
    await addLotOccupancyOccupant(request.body, request.session.user);
    const lotOccupancyOccupants = await getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyOccupants
    });
}
export default handler;
