import updateLotTypeField from '../../database/updateLotTypeField.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await updateLotTypeField(request.body, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
