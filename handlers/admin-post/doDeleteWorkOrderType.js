import { deleteRecord } from '../../database/deleteRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await deleteRecord('WorkOrderTypes', request.body.workOrderTypeId, request.session.user);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
