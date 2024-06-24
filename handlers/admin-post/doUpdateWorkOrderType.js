import { updateRecord } from '../../database/updateRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await updateRecord('WorkOrderTypes', request.body.workOrderTypeId, request.body.workOrderType, request.session.user);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
