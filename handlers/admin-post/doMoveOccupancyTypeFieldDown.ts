import type { RequestHandler } from "express";

import {
    moveOccupancyTypeFieldDown,
    moveOccupancyTypeFieldDownToBottom
} from "../../helpers/lotOccupancyDB/moveOccupancyTypeFieldDown.js";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToBottom === "1"
            ? moveOccupancyTypeFieldDownToBottom(request.body.occupancyTypeFieldId)
            : moveOccupancyTypeFieldDown(request.body.occupancyTypeFieldId);

    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
