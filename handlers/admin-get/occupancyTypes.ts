import type { RequestHandler } from "express";

import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

export const handler: RequestHandler = (_request, response) => {
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();

    response.render("admin-occupancyTypes", {
        headTitle: configFunctions.getProperty("aliases.occupancy") + " Type Management",
        occupancyTypes,
        allOccupancyTypeFields
    });
};

export default handler;
