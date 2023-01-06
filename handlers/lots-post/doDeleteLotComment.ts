import type { RequestHandler } from "express";

import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";

import { getLotComments } from "../../helpers/lotOccupancyDB/getLotComments.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteRecord("LotComments", request.body.lotCommentId, request.session);

    const lotComments = getLotComments(request.body.lotId);

    response.json({
        success,
        lotComments
    });
};

export default handler;
