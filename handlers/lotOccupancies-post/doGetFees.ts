import type { RequestHandler } from "express";

import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";

import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";

export const handler: RequestHandler = (request, response) => {
    const lotOccupancyId = request.body.lotOccupancyId;

    const lotOccupancy = getLotOccupancy(lotOccupancyId);

    const feeCategories = getFeeCategories(
        {
            occupancyTypeId: lotOccupancy.occupancyTypeId,
            lotTypeId: lotOccupancy.lotTypeId
        },
        {
            includeFees: true
        }
    );

    response.json({
        feeCategories
    });
};

export default handler;
