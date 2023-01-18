import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const workOrderTypeId = await addRecord('WorkOrderTypes', request.body.workOrderType, request.body.orderNumber ?? -1, request.session);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success: true,
        workOrderTypeId,
        workOrderTypes
    });
}
export default handler;
