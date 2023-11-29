import { getLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js';
import { updateLotOccupancyOccupant } from '../../helpers/lotOccupancyDB/updateLotOccupancyOccupant.js';
export async function handler(request, response) {
    const success = await updateLotOccupancyOccupant(request.body, request.session.user);
    const lotOccupancyOccupants = await getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyOccupants
    });
}
export default handler;
