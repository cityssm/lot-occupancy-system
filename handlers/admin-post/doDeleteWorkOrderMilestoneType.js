import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../database/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId, request.session.user);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
}
export default handler;
