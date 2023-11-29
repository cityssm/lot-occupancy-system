import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js';
export async function handler(request, response) {
    const success = await updateRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId, request.body.workOrderMilestoneType, request.session.user);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
}
export default handler;
