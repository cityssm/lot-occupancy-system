import { updateLotTypeField } from '../../helpers/lotOccupancyDB/updateLotTypeField.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await updateLotTypeField(request.body, request.session);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
