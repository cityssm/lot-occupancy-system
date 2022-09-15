import type { RequestHandler } from "express";

import { updateWorkOrderMilestoneType } from "../../helpers/lotOccupancyDB/updateWorkOrderMilestoneType.js";

import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateWorkOrderMilestoneType(request.body, request.session);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
