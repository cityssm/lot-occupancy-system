import type {
    RequestHandler
} from "express";

import {
    deleteLotOccupancyFee
} from "../../helpers/lotOccupancyDB/deleteLotOccupancyFee.js";

import {
    getLotOccupancyFees
} from "../../helpers/lotOccupancyDB/getLotOccupancyFees.js";


export const handler: RequestHandler = async (request, response) => {

    const success = deleteLotOccupancyFee(request.body.lotOccupancyId, request.body.feeId, request.session);

    const lotOccupancyFees = getLotOccupancyFees(request.body.lotOccupancyId);

    response.json({
        success,
        lotOccupancyFees
    });
};


export default handler;