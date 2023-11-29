import { getLotStatuses } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../database/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotStatuses', request.body.lotStatusId, request.session.user);
    const lotStatuses = await getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
}
export default handler;
