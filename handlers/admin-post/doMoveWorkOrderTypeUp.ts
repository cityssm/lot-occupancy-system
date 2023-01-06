import type { RequestHandler } from "express";

import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getWorkOrderTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordUpToTop("WorkOrderTypes", request.body.workOrderTypeId)
            : moveRecordUp("WorkOrderTypes", request.body.workOrderTypeId);

    const workOrderTypes = getWorkOrderTypes();

    response.json({
        success,
        workOrderTypes
    });
};

export default handler;
