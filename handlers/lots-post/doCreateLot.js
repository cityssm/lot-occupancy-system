import { addLot } from '../../helpers/lotOccupancyDB/addLot.js';
export async function handler(request, response) {
    const lotId = await addLot(request.body, request.session);
    response.json({
        success: true,
        lotId
    });
}
export default handler;
