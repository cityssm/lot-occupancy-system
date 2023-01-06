import type { RequestHandler } from "express";

import { updateRecord } from "../../helpers/lotOccupancyDB/updateRecord.js";
import { getWorkOrderTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateRecord(
        "WorkOrderTypes",
        request.body.workOrderTypeId,
        request.body.workOrderType,
        request.session
    );

    const workOrderTypes = getWorkOrderTypes();

    response.json({
        success,
        workOrderTypes
    });
};

export default handler;
