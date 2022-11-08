import type { RequestHandler } from "express";

import { copyLotOccupancy } from "../../helpers/lotOccupancyDB/copyLotOccupancy.js";

export const handler: RequestHandler = async (request, response) => {
    const lotOccupancyId = copyLotOccupancy(request.body.lotOccupancyId, request.session);

    response.json({
        success: true,
        lotOccupancyId
    });
};

export default handler;
