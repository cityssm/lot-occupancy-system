import type { RequestHandler } from "express";

import {
    moveFeeCategoryDown,
    moveFeeCategoryDownToBottom
} from "../../helpers/lotOccupancyDB/moveFeeCategoryDown.js";

import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveFeeCategoryDownToBottom(request.body.feeCategoryId)
            : moveFeeCategoryDown(request.body.feeCategoryId);

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
