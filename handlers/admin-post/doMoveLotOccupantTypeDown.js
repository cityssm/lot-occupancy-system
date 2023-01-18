import { moveRecordDown, moveRecordDownToBottom } from '../../helpers/lotOccupancyDB/moveRecord.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('LotOccupantTypes', request.body.lotOccupantTypeId)
        : await moveRecordDown('LotOccupantTypes', request.body.lotOccupantTypeId);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
}
export default handler;
