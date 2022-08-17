import type {
    RequestHandler
} from "express";

import {
    addFee
} from "../../helpers/lotOccupancyDB/addFee.js";

import {
    getFeeCategories
} from "../../helpers/lotOccupancyDB/getFeeCategories.js";



export const handler: RequestHandler = async (request, response) => {

    const feeId = addFee(request.body, request.session);

    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });

    response.json({
        success: true,
        feeId,
        feeCategories
    });
};


export default handler;