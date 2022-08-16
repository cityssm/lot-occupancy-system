import type {
    RequestHandler
} from "express";

import {
    addFeeCategory
} from "../../helpers/lotOccupancyDB/addFeeCategory.js";

import {
    getFeeCategories
} from "../../helpers/lotOccupancyDB/getFeeCategories.js";



export const handler: RequestHandler = async (request, response) => {

    const feeCategoryId = addFeeCategory(request.body, request.session);

    const feeCategories = getFeeCategories({}, {
        includeFees: true
    });

    response.json({
        success: true,
        feeCategoryId,
        feeCategories
    });
};


export default handler;