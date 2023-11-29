import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
export async function handler(request, response) {
    const success = await deleteRecord('WorkOrderMilestones', request.body.workOrderMilestoneId, request.session.user);
    const workOrderMilestones = await getWorkOrderMilestones({
        workOrderId: request.body.workOrderId
    }, {
        orderBy: 'completion'
    });
    response.json({
        success,
        workOrderMilestones
    });
}
export default handler;
