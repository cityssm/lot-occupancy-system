import type { RequestHandler } from "express";

import { moveRecordDown, moveRecordDownToBottom } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getLotTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordDownToBottom("LotTypes", request.body.lotTypeId)
            : moveRecordDown("LotTypes", request.body.lotTypeId);

    const lotTypes = getLotTypes();

    response.json({
        success,
        lotTypes
    });
};

export default handler;
