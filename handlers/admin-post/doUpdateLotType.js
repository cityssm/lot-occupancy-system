import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await updateRecord('LotTypes', request.body.lotTypeId, request.body.lotType, request.session);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
