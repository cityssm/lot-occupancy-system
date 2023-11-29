import { getLotStatuses } from '../../helpers/functions.cache.js';
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
export async function handler(request, response) {
    const success = await updateRecord('LotStatuses', request.body.lotStatusId, request.body.lotStatus, request.session.user);
    const lotStatuses = await getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
}
export default handler;
