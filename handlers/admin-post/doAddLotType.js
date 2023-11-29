import { getLotTypes } from '../../helpers/functions.cache.js';
import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
export async function handler(request, response) {
    const lotTypeId = await addRecord('LotTypes', request.body.lotType, request.body.orderNumber ?? -1, request.session.user);
    const lotTypes = await getLotTypes();
    response.json({
        success: true,
        lotTypeId,
        lotTypes
    });
}
export default handler;
