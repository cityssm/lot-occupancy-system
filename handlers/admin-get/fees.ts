import type { RequestHandler } from "express";

import {
    getLotTypes,
    getOccupancyTypes
} from "../../helpers/functions.cache.js";

import { getFeeCategories } from "../../helpers/lotOccupancyDB/getFeeCategories.js";

export const handler: RequestHandler = (_request, response) => {
    const feeCategories = getFeeCategories(
        {},
        {
            includeFees: true
        }
    );

    const occupancyTypes = getOccupancyTypes();
    const lotTypes = getLotTypes();

    response.render("admin-fees", {
        headTitle: "Fee Management",
        feeCategories,
        occupancyTypes,
        lotTypes
    });
};

export default handler;
