import { getLotTypes } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotTypes', request.body.lotTypeId, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
