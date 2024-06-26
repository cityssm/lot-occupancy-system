import { moveLotTypeFieldDown, moveLotTypeFieldDownToBottom } from '../../database/moveLotTypeField.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveLotTypeFieldDownToBottom(request.body.lotTypeFieldId)
        : await moveLotTypeFieldDown(request.body.lotTypeFieldId);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
