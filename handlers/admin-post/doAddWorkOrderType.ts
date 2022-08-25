import type {
    RequestHandler
} from "express";

import {
    addWorkOrderType
} from "../../helpers/lotOccupancyDB/addWorkOrderType.js";

import {
    getWorkOrderTypes
} from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

    const workOrderTypeId = addWorkOrderType(request.body, request.session);

    const workOrderTypes = getWorkOrderTypes();

    response.json({
        success: true,
        workOrderTypeId,
        workOrderTypes
    });
};


export default handler;