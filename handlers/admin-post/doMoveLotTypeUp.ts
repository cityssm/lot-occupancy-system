import type { RequestHandler } from "express";

import { moveLotTypeUp, moveLotTypeUpToTop } from "../../helpers/lotOccupancyDB/moveLotTypeUp.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToTop === "1"
            ? moveLotTypeUpToTop(request.body.lotTypeId)
            : moveLotTypeUp(request.body.lotTypeId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
