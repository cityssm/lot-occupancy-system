import type { RequestHandler } from "express";

import { deleteLotStatus } from "../../helpers/lotOccupancyDB/deleteLotStatus.js";

import { getLotStatuses } from "../../helpers/functions.cache.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteLotStatus(request.body.lotStatusId, request.session);

    const lotStatuses = getLotStatuses();

    response.json({
        success,
        lotStatuses
    });
};

export default handler;
