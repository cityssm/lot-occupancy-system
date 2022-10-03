import type { RequestHandler } from "express";

import {
    moveFeeCategoryUp,
    moveFeeCategoryUpToTop
} from "../../helpers/lotOccupancyDB/moveFeeCategoryUp.js";

import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToTop === "1"
            ? moveFeeCategoryUpToTop(request.body.feeCategoryId)
            : moveFeeCategoryUp(request.body.feeCategoryId);

    const feeCategories = getFeeCategories(
        {},
        {
            includeFees: true
        }
    );

    response.json({
        success,
        feeCategories
    });
};

export default handler;
