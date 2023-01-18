import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await updateRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId, request.body.workOrderMilestoneType, request.session);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
}
export default handler;
