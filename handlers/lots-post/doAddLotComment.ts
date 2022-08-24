import type {
    RequestHandler
} from "express";

import {
    addLotComment
} from "../../helpers/lotOccupancyDB/addLotComment.js";

import {
    getLotComments
} from "../../helpers/lotOccupancyDB/getLotComments.js";


export const handler: RequestHandler = async (request, response) => {

    addLotComment(request.body, request.session);

    const lotComments = getLotComments(request.body.lotId);

    response.json({
        success: true,
        lotComments
    });
};


export default handler;