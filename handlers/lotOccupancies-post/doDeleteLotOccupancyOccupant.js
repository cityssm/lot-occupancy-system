import { deleteLotOccupancyOccupant } from '../../helpers/lotOccupancyDB/deleteLotOccupancyOccupant.js';
import { getLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js';
export async function handler(request, response) {
    const success = await deleteLotOccupancyOccupant(request.body.lotOccupancyId, request.body.lotOccupantIndex, request.session.user);
    const lotOccupancyOccupants = await getLotOccupancyOccupants(request.body.lotOccupancyId);
    response.json({
        success,
        lotOccupancyOccupants
    });
}
export default handler;
