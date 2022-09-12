import { completeWorkOrderMilestone } from "../../helpers/lotOccupancyDB/completeWorkOrderMiletstone.js";
import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";
export const handler = async (request, response) => {
    const success = completeWorkOrderMilestone({
        workOrderMilestoneId: request.body.workOrderMilestoneId
    }, request.session);
    const workOrderMilestones = getWorkOrderMilestones(request.body.workOrderId);
    response.json({
        success,
        workOrderMilestones
    });
};
export default handler;
