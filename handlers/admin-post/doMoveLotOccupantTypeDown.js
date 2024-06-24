import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('LotOccupantTypes', request.body.lotOccupantTypeId)
        : await moveRecordDown('LotOccupantTypes', request.body.lotOccupantTypeId);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
}
