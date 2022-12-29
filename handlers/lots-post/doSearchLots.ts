import type { RequestHandler } from "express";

import { getLots } from "../../helpers/lotOccupancyDB/getLots.js";

export const handler: RequestHandler = async (request, response) => {
    const result = getLots(request.body, {
        limit: request.body.limit,
        offset: request.body.offset
    });

    response.json({
        count: result.count,
        offset: Number.parseInt(request.body.offset, 10),
        lots: result.lots
    });
};

export default handler;
