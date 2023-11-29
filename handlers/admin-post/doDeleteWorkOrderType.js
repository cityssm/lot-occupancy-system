import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderTypes', request.body.workOrderTypeId, request.session.user);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
export default handler;
