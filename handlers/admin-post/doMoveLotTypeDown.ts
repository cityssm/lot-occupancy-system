import type { RequestHandler } from "express";

import { moveLotTypeDown } from "../../helpers/lotOccupancyDB/moveLotTypeDown.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = moveLotTypeDown(request.body.lotTypeId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
