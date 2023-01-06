import type { RequestHandler } from "express";

import { updateRecord } from "../../helpers/lotOccupancyDB/updateRecord.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateRecord(
        "WorkOrderMilestoneTypes",
        request.body.workOrderMilestoneTypeId,
        request.body.workOrderMilestoneType,
        request.session
    );

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    response.json({
        success,
        workOrderMilestoneTypes
    });
};

export default handler;
