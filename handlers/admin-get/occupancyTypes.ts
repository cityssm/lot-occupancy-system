import type { RequestHandler } from "express";

import { getOccupancyTypes } from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

export const handler: RequestHandler = (_request, response) => {
    const occupancyTypes = getOccupancyTypes();

    response.render("admin-occupancyTypes", {
        headTitle:
            configFunctions.getProperty("aliases.occupancy") +
            " Type Management",
        occupancyTypes
    });
};

export default handler;
