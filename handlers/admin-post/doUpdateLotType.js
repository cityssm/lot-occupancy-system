import { updateRecord } from '../../database/updateRecord.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await updateRecord('LotTypes', request.body.lotTypeId, request.body.lotType, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
