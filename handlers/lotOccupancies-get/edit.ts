import type {
    RequestHandler
} from "express";

import {
    getOccupancyTypes
} from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

import {
    getLotOccupancy
} from "../../helpers/lotOccupancyDB/getLotOccupancy.js";


export const handler: RequestHandler = (request, response) => {

    const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId);

    if (!lotOccupancy) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lotOccupancies/?error=lotOccupancyIdNotFound");
    }

    const occupancyTypes = getOccupancyTypes();

    return response.render("lotOccupancy-edit", {
        headTitle: configFunctions.getProperty("aliases.lot") + " " + configFunctions.getProperty("aliases.occupancy") + "  Update",
        lotOccupancy,

        occupancyTypes,
        isCreate: false
    });
};


export default handler;