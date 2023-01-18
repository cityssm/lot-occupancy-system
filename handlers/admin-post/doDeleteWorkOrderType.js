import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderTypes', request.body.workOrderTypeId, request.session);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
export default handler;
