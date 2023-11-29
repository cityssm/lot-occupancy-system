import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
import { reopenWorkOrderMilestone } from '../../helpers/lotOccupancyDB/reopenWorkOrderMilestone.js';
export async function handler(request, response) {
    const success = await reopenWorkOrderMilestone(request.body.workOrderMilestoneId, request.session.user);
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
