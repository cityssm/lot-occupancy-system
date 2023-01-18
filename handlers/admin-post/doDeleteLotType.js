import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotTypes', request.body.lotTypeId, request.session);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
