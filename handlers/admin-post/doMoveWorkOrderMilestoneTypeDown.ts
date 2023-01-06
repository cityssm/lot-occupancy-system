import type { RequestHandler } from "express";

import { moveRecordDown, moveRecordDownToBottom } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordDownToBottom("WorkOrderMilestoneTypes", request.body.workOrderMilestoneTypeId)
            : moveRecordDown("WorkOrderMilestoneTypes", request.body.workOrderMilestoneTypeId);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
