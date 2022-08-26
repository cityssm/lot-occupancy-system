import type {
    RequestHandler
} from "express";

import {
    moveLotStatusDown
} from "../../helpers/lotOccupancyDB/moveLotStatusDown.js";

import {
    getLotStatuses
} from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

    const success = moveLotStatusDown(request.body.lotStatusId);

    const lotStatuses = getLotStatuses();

    response.json({
        success,
        lotStatuses
    });
};


export default handler;