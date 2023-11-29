import { getLotTypes } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../database/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotTypeFields', request.body.lotTypeFieldId, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
