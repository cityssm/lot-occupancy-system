import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
import { updateWorkOrderMilestone } from '../../helpers/lotOccupancyDB/updateWorkOrderMilestone.js';
export async function handler(request, response) {
    const success = await updateWorkOrderMilestone(request.body, request.session.user);
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
