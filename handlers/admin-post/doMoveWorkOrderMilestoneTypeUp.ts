import type { RequestHandler } from "express";

import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordUpToTop("WorkOrderMilestoneTypes", request.body.workOrderMilestoneTypeId)
            : moveRecordUp("WorkOrderMilestoneTypes", request.body.workOrderMilestoneTypeId);

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
