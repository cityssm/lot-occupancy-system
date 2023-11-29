import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
import { addRecord } from '../../database/addRecord.js';
export async function handler(request, response) {
    const workOrderMilestoneTypeId = await addRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneType, request.body.orderNumber ?? -1, request.session.user);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success: true,
        workOrderMilestoneTypeId,
        workOrderMilestoneTypes
    });
}
export default handler;
