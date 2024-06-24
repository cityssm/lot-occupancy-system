import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('WorkOrderTypes', request.body.workOrderTypeId)
        : await moveRecordUp('WorkOrderTypes', request.body.workOrderTypeId);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
