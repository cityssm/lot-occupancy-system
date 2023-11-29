import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { updateLot } from '../../database/updateLot.js';
export async function handler(request, response) {
    const lotId = Number.parseInt(request.body.lotId, 10);
    const success = await updateLot(request.body, request.session.user);
    response.json({
        success,
        lotId: request.body.lotId
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache(lotId);
    });
}
export default handler;
