import type { RequestHandler } from "express";

import { deleteWorkOrderMilestone } from "../../helpers/lotOccupancyDB/deleteWorkOrderMilestone.js";

import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteWorkOrderMilestone(
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
