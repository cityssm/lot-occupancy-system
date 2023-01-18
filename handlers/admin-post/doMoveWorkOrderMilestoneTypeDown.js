import { moveRecordDown, moveRecordDownToBottom } from '../../helpers/lotOccupancyDB/moveRecord.js';
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId)
        : await moveRecordDown('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
}
export default handler;
