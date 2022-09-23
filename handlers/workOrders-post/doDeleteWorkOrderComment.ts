import type { RequestHandler } from "express";

import { deleteWorkOrderComment } from "../../helpers/lotOccupancyDB/deleteWorkOrderComment.js";

import { getWorkOrderComments } from "../../helpers/lotOccupancyDB/getWorkOrderComments.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteWorkOrderComment(request.body.workOrderCommentId, request.session);

    const workOrderComments = getWorkOrderComments(request.body.workOrderId);

    response.json({
        success,
        workOrderComments
    });
};

export default handler;
