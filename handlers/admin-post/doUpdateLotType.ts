import type { RequestHandler } from "express";

import { updateLotType } from "../../helpers/lotOccupancyDB/updateLotType.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateLotType(request.body, request.session);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
