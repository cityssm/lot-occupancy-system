import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { deleteRecord } from '../../database/deleteRecord.js';
export async function handler(request, response) {
    const lotId = Number.parseInt(request.body.lotId, 10);
    const success = await deleteRecord('Lots', lotId, request.session.user);
    response.json({
        success
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache(lotId);
    });
}
export default handler;
