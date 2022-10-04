import type { RequestHandler } from "express";

import {
    moveOccupancyTypeFieldUp,
    moveOccupancyTypeFieldUpToTop
} from "../../helpers/lotOccupancyDB/moveOccupancyTypeFieldUp.js";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToTop === "1"
            ? moveOccupancyTypeFieldUpToTop(request.body.occupancyTypeFieldId)
            : moveOccupancyTypeFieldUp(request.body.occupancyTypeFieldId);

    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
