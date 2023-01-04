import type { RequestHandler } from "express";

import {
    moveWorkOrderMilestoneTypeDown,
    moveWorkOrderMilestoneTypeDownToBottom
} from "../../helpers/lotOccupancyDB/moveWorkOrderMilestoneTypeDown.js";

import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveWorkOrderMilestoneTypeDownToBottom(request.body.workOrderMilestoneTypeId)
            : moveWorkOrderMilestoneTypeDown(request.body.workOrderMilestoneTypeId);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
