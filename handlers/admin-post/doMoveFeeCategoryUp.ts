import type { RequestHandler } from "express";

import { moveRecordUp, moveRecordUpToTop } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";

export const handler: RequestHandler = async (request, response) => {
    const success =
        request.body.moveToEnd === "1"
            ? moveRecordUpToTop("FeeCategories", request.body.feeCategoryId)
            : moveRecordUp("FeeCategories", request.body.feeCategoryId);

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
