import type { RequestHandler } from "express";

import { moveLotTypeFieldUp } from "../../helpers/lotOccupancyDB/moveLotTypeFieldUp.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = moveLotTypeFieldUp(request.body.lotTypeFieldId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
