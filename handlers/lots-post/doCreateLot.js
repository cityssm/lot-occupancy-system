import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { addLot } from '../../database/addLot.js';
export async function handler(request, response) {
    const lotId = await addLot(request.body, request.session.user);
    response.json({
        success: true,
        lotId
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache(-1);
    });
}
export default handler;
