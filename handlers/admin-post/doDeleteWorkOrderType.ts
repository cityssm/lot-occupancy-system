import type { RequestHandler } from "express";

import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";

import { getWorkOrderTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteRecord("WorkOrderTypes", request.body.workOrderTypeId, request.session);

    const workOrderTypes = getWorkOrderTypes();

    response.json({
        success,
        workOrderTypes
    });
};

export default handler;
