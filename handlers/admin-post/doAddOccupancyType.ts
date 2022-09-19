import type { RequestHandler } from "express";

import { addOccupancyType } from "../../helpers/lotOccupancyDB/addOccupancyType.js";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const occupancyTypeId = addOccupancyType(request.body, request.session);

    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.json({
        success: true,
        occupancyTypeId,
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
