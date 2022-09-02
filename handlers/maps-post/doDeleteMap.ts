import type { RequestHandler } from "express";

import { deleteMap } from "../../helpers/lotOccupancyDB/deleteMap.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteMap(request.body.mapId, request.session);

    response.json({
        success
    });
};

export default handler;
