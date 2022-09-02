import type { RequestHandler } from "express";

import { getWorkOrders } from "../../helpers/lotOccupancyDB/getWorkOrders.js";

export const handler: RequestHandler = async (request, response) => {
    const result = getWorkOrders(request.body, {
        limit: request.body.limit,
        offset: request.body.offset
    });

    response.json({
        count: result.count,
        workOrders: result.workOrders
    });
};

export default handler;
