import type {
    RequestHandler
} from "express";

import {
    updateFeeCategory
} from "../../helpers/lotOccupancyDB/updateFeeCategory.js";

import {
    getFeeCategories
} from "../../helpers/lotOccupancyDB/getFeeCategories.js";



export const handler: RequestHandler = async (request, response) => {

    const success = updateFeeCategory(request.body, request.session);

    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });

    response.json({
        success,
        feeCategories
    });
};


export default handler;