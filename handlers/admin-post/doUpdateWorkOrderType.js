import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
import { updateRecord } from '../../database/updateRecord.js';
export async function handler(request, response) {
    const success = await updateRecord('WorkOrderTypes', request.body.workOrderTypeId, request.body.workOrderType, request.session.user);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
export default handler;
