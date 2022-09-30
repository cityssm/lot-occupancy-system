import type { RequestHandler } from "express";

import { moveLotTypeUp } from "../../helpers/lotOccupancyDB/moveLotTypeUp.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = moveLotTypeUp(request.body.lotTypeId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
