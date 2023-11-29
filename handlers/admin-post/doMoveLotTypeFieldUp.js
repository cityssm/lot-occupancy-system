import { moveLotTypeFieldUp, moveLotTypeFieldUpToTop } from '../../database/moveLotTypeField.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveLotTypeFieldUpToTop(request.body.lotTypeFieldId)
        : await moveLotTypeFieldUp(request.body.lotTypeFieldId);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
