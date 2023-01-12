import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
import { getLotStatuses } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const success = updateRecord('LotStatuses', request.body.lotStatusId, request.body.lotStatus, request.session);
    const lotStatuses = getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
};
export default handler;
