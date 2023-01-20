import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { addLot } from '../../helpers/lotOccupancyDB/addLot.js';
export async function handler(request, response) {
    const lotId = await addLot(request.body, request.session);
    response.json({
        success: true,
        lotId
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache();
    });
}
export default handler;
