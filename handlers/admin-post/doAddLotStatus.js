import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
import { getLotStatuses } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const lotStatusId = addRecord('LotStatuses', request.body.lotStatus, request.body.orderNumber ?? -1, request.session);
    const lotStatuses = getLotStatuses();
    response.json({
        success: true,
        lotStatusId,
        lotStatuses
    });
};
export default handler;
