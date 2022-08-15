import type {
    RequestHandler
} from "express";

import { getOccupancyTypeById } from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

    const result = getOccupancyTypeById(Number.parseInt(request.body.occupancyTypeId, 10));

    response.json({
        occupancyTypeFields: result.occupancyTypeFields
    });
};


export default handler;