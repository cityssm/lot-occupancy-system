import { deleteRecord } from '../../database/deleteRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await deleteRecord('LotTypeFields', request.body.lotTypeFieldId, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
