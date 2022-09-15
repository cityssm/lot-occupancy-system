import type { RequestHandler } from "express";

import { addWorkOrderMilestoneType } from "../../helpers/lotOccupancyDB/addWorkOrderMilestoneType.js";

import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const workOrderMilestoneTypeId = addWorkOrderMilestoneType(request.body, request.session);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success: true,
        workOrderMilestoneTypeId,
        workOrderMilestoneTypes
    });
};

export default handler;
