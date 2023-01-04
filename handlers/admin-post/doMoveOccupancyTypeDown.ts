import type { RequestHandler } from "express";

import {
    moveOccupancyTypeDown,
    moveOccupancyTypeDownToBottom
} from "../../helpers/lotOccupancyDB/moveOccupancyTypeDown.js";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveOccupancyTypeDownToBottom(request.body.occupancyTypeId)
            : moveOccupancyTypeDown(request.body.occupancyTypeId);

    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
