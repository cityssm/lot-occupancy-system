import { deleteRecord } from '../../database/deleteRecord.js';
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await deleteRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneTypeId, request.session.user);
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
}
