import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotTypeFields', request.body.lotTypeFieldId, request.session);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
