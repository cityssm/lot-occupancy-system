import type { RequestHandler } from "express";

import { updateMap } from "../../helpers/lotOccupancyDB/updateMap.js";

export const handler: RequestHandler = async (request, response) => {
    const success = updateMap(request.body, request.session);

    response.json({
        success,
        mapId: request.body.mapId
    });
};

export default handler;
