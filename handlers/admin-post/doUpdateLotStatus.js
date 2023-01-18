import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
import { getLotStatuses } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await updateRecord('LotStatuses', request.body.lotStatusId, request.body.lotStatus, request.session);
    const lotStatuses = await getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
}
export default handler;
