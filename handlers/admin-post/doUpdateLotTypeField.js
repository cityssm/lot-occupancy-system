import { getLotTypes } from '../../helpers/functions.cache.js';
import { updateLotTypeField } from '../../helpers/lotOccupancyDB/updateLotTypeField.js';
export async function handler(request, response) {
    const success = await updateLotTypeField(request.body, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success,
        lotTypes
    });
}
export default handler;
