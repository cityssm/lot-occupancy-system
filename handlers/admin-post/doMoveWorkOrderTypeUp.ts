import type { RequestHandler } from "express";

import {
    moveWorkOrderTypeUp,
    moveWorkOrderTypeUpToTop
} from "../../helpers/lotOccupancyDB/moveWorkOrderTypeUp.js";

import { getWorkOrderTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveWorkOrderTypeUpToTop(request.body.workOrderTypeId)
            : moveWorkOrderTypeUp(request.body.workOrderTypeId);

    const workOrderTypes = getWorkOrderTypes();

    response.json({
        success,
        workOrderTypes
    });
};

export default handler;
