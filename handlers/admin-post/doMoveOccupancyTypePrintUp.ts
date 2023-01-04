import type { RequestHandler } from "express";

import {
    moveOccupancyTypePrintUp,
    moveOccupancyTypePrintUpToTop
} from "../../helpers/lotOccupancyDB/moveOccupancyTypePrintUp.js";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveOccupancyTypePrintUpToTop(request.body.occupancyTypeId, request.body.printEJS)
            : moveOccupancyTypePrintUp(request.body.occupancyTypeId, request.body.printEJS);

    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
