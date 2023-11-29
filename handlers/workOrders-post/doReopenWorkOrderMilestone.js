import { getWorkOrderMilestones } from '../../database/getWorkOrderMilestones.js';
import { reopenWorkOrderMilestone } from '../../database/reopenWorkOrderMilestone.js';
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
