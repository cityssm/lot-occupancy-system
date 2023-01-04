import type { RequestHandler } from "express";

import {
    moveWorkOrderMilestoneTypeUp,
    moveWorkOrderMilestoneTypeUpToTop
} from "../../helpers/lotOccupancyDB/moveWorkOrderMilestoneTypeUp.js";

import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveWorkOrderMilestoneTypeUpToTop(request.body.workOrderMilestoneTypeId)
            : moveWorkOrderMilestoneTypeUp(request.body.workOrderMilestoneTypeId);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
