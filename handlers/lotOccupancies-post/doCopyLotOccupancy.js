import { copyLotOccupancy } from '../../helpers/lotOccupancyDB/copyLotOccupancy.js';
export async function handler(request, response) {
    const lotOccupancyId = await copyLotOccupancy(request.body.lotOccupancyId, request.session.user);
    response.json({
        success: true,
        lotOccupancyId
    });
}
export default handler;
