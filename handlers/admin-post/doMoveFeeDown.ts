import type {
    RequestHandler
} from "express";

import {
    moveFeeDown
} from "../../helpers/lotOccupancyDB/moveFeeDown.js";

import {
    getFeeCategories
} from "../../helpers/lotOccupancyDB/getFeeCategories.js";


export const handler: RequestHandler = async (request, response) => {

    const success = moveFeeDown(request.body.feeId);

    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });

    response.json({
        success,
        feeCategories
    });
};


export default handler;