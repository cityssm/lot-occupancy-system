import type { RequestHandler } from "express";

import { addLotStatus } from "../../helpers/lotOccupancyDB/addLotStatus.js";

import { getLotStatuses } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const lotStatusId = addLotStatus(request.body, request.session);

    const lotStatuses = getLotStatuses();

    response.json({
        success: true,
        lotStatusId,
        lotStatuses
    });
};

export default handler;
