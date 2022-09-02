import type { RequestHandler } from "express";

import { addLot } from "../../helpers/lotOccupancyDB/addLot.js";

export const handler: RequestHandler = async (request, response) => {
    const lotId = addLot(request.body, request.session);

    response.json({
        success: true,
        lotId
    });
};

export default handler;
