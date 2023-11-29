import { updateLotOccupancy } from '../../database/updateLotOccupancy.js';
export async function handler(request, response) {
    const success = await updateLotOccupancy(request.body, request.session.user);
    response.json({
        success,
        lotOccupancyId: request.body.lotOccupancyId
    });
}
export default handler;
