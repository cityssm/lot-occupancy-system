import type { RequestHandler } from "express";

import { updateOccupancyTypeField } from "../../helpers/lotOccupancyDB/updateOccupancyTypeField.js";

import { getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateOccupancyTypeField(request.body, request.session);

    const occupancyTypes = getOccupancyTypes();

    response.json({
        success,
        occupancyTypes
    });
};

export default handler;
