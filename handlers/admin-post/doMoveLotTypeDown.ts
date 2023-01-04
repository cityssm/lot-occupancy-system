import type { RequestHandler } from "express";

import {
    moveLotTypeDown,
    moveLotTypeDownToBottom
} from "../../helpers/lotOccupancyDB/moveLotTypeDown.js";

import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveLotTypeDownToBottom(request.body.lotTypeId)
            : moveLotTypeDown(request.body.lotTypeId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
