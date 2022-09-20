import type { RequestHandler } from "express";

import { deleteLot } from "../../helpers/lotOccupancyDB/deleteLot.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteLot(
        request.body.lotId,
        request.session
    );

    response.json({
        success
    });
};

export default handler;
