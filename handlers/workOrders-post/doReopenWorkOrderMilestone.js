import { reopenWorkOrderMilestone } from "../../helpers/lotOccupancyDB/reopenWorkOrderMilestone.js";
import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";
export const handler = async (request, response) => {
    const success = reopenWorkOrderMilestone(request.body.workOrderMilestoneId, request.session);
    const workOrderMilestones = getWorkOrderMilestones({
        workOrderId: request.body.workOrderId
    });
    response.json({
        success,
        workOrderMilestones
    });
};
export default handler;
