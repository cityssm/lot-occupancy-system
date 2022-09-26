import type { RequestHandler } from "express";

import { getOccupancyTypeById, getAllOccupancyTypeFields } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const occupancyTypeFields = getAllOccupancyTypeFields();

    const result = getOccupancyTypeById(Number.parseInt(request.body.occupancyTypeId, 10));

    occupancyTypeFields.push(...result.occupancyTypeFields);

    response.json({
        occupancyTypeFields
    });
};

export default handler;
