import type { RequestHandler } from "express";

import { updateWorkOrderMilestone } from "../../helpers/lotOccupancyDB/updateWorkOrderMilestone.js";
import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateWorkOrderMilestone(request.body, request.session);

    const workOrderMilestones = getWorkOrderMilestones(
        {
            workOrderId: request.body.workOrderId
        },
        {
            orderBy: "completion"
        }
    );

    response.json({
        success,
        workOrderMilestones
    });
};

export default handler;