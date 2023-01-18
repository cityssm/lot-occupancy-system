import { updateLot } from '../../helpers/lotOccupancyDB/updateLot.js';
export async function handler(request, response) {
    const success = await updateLot(request.body, request.session);
    response.json({
        success,
        lotId: request.body.lotId
    });
}
export default handler;
