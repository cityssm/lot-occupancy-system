import { completeWorkOrderMilestone } from '../../helpers/lotOccupancyDB/completeWorkOrderMilestone.js';
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
export const handler = (request, response) => {
    const success = completeWorkOrderMilestone({
        workOrderMilestoneId: request.body.workOrderMilestoneId
    }, request.session);
    const workOrderMilestones = getWorkOrderMilestones({
        workOrderId: request.body.workOrderId
    }, {
        orderBy: 'completion'
    });
    response.json({
        success,
        workOrderMilestones
    });
};
export default handler;
