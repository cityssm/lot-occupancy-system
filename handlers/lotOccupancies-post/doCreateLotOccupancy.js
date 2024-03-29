import { addLotOccupancy } from '../../database/addLotOccupancy.js';
export async function handler(request, response) {
    const lotOccupancyId = await addLotOccupancy(request.body, request.session.user);
    response.json({
        success: true,
        lotOccupancyId
    });
}
export default handler;
