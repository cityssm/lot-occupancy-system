import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('WorkOrderTypes', request.body.workOrderTypeId)
        : await moveRecordDown('WorkOrderTypes', request.body.workOrderTypeId);
    const workOrderTypes = await getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
}
