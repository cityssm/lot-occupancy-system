import { deleteRecord } from '../../database/deleteRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotTypes', request.body.lotTypeId, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
