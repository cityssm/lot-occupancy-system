import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
import { getLotStatuses } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('LotStatuses', request.body.lotStatusId)
        : await moveRecordDown('LotStatuses', request.body.lotStatusId);
    const lotStatuses = await getLotStatuses();
    response.json({
        success,
        lotStatuses
    });
}
