import { updateWorkOrderMilestone } from '../../helpers/lotOccupancyDB/updateWorkOrderMilestone.js';
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
export async function handler(request, response) {
    const success = await updateWorkOrderMilestone(request.body, request.session);
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
