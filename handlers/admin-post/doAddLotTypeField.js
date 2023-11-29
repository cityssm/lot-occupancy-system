import { getLotTypes } from '../../helpers/functions.cache.js';
import { addLotTypeField } from '../../database/addLotTypeField.js';
export async function handler(request, response) {
    const lotTypeFieldId = await addLotTypeField(request.body, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success: true,
        lotTypeFieldId,
        lotTypes
    });
}
export default handler;
