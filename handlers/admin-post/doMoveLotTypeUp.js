import { moveRecordUp, moveRecordUpToTop } from '../../helpers/lotOccupancyDB/moveRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('LotTypes', request.body.lotTypeId)
        : await moveRecordUp('LotTypes', request.body.lotTypeId);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
