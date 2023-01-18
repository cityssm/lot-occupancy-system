import { addLotOccupancyOccupant } from '../../helpers/lotOccupancyDB/addLotOccupancyOccupant.js';
import { getLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js';
export async function handler(request, response) {
    await addLotOccupancyOccupant(request.body, request.session);
    const lotOccupancyOccupants = await getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyOccupants
    });
}
export default handler;
