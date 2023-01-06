import type { RequestHandler } from "express";

import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getLotOccupantTypes } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordUpToTop("LotOccupantTypes", request.body.lotOccupantTypeId)
            : moveRecordUp("LotOccupantTypes", request.body.lotOccupantTypeId);

    const lotOccupantTypes = getLotOccupantTypes();

    response.json({
        success,
        lotOccupantTypes
    });
};

export default handler;
