import { updateLotOccupancy } from '../../helpers/lotOccupancyDB/updateLotOccupancy.js';
export async function handler(request, response) {
    const success = await updateLotOccupancy(request.body, request.session);
    response.json({
        success,
        lotOccupancyId: request.body.lotOccupancyId
    });
}
export default handler;
