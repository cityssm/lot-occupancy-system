import { updateLotOccupancyOccupant } from '../../helpers/lotOccupancyDB/updateLotOccupancyOccupant.js';
import { getLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js';
export async function handler(request, response) {
    const success = await updateLotOccupancyOccupant(request.body, request.session);
    const lotOccupancyOccupants = await getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyOccupants
    });
}
export default handler;
