import type { RequestHandler } from "express";

import { reopenWorkOrderMilestone } from "../../helpers/lotOccupancyDB/reopenWorkOrderMilestone.js";

import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";

export const handler: RequestHandler = async (request, response) => {
    const success = reopenWorkOrderMilestone(
        request.body.workOrderMilestoneId,
        request.session
    );

    const workOrderMilestones = getWorkOrderMilestones(
        request.body.workOrderId
    );

    response.json({
        success,
        workOrderMilestones
    });
};

export default handler;