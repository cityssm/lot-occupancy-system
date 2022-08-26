import type {
    RequestHandler
} from "express";

import {
    moveLotOccupantTypeDown
} from "../../helpers/lotOccupancyDB/moveLotOccupantTypeDown.js";

import {
    getLotOccupantTypes
} from "../../helpers/functions.cache.js";


export const handler: RequestHandler = async (request, response) => {

    const success = moveLotOccupantTypeDown(request.body.lotOccupantTypeId);

    const lotOccupantTypes = getLotOccupantTypes();

    response.json({
        success,
        lotOccupantTypes
    });
};


export default handler;