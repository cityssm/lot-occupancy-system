import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await updateRecord('WorkOrderTypes', request.body.workOrderTypeId, request.body.workOrderType, request.session);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
export default handler;
