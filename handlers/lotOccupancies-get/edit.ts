import type { RequestHandler } from "express";

import {
    getLotOccupantTypes,
    getLotStatuses,
    getLotTypes,
    getOccupancyTypes,
    getWorkOrderTypes
} from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";

export const handler: RequestHandler = (request, response) => {
    const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId);

    if (!lotOccupancy) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/lotOccupancies/?error=lotOccupancyIdNotFound"
        );
    }

    const occupancyTypes = getOccupancyTypes();
    const lotOccupantTypes = getLotOccupantTypes();
    const lotTypes = getLotTypes();
    const lotStatuses = getLotStatuses();
    const maps = getMaps();
    const workOrderTypes = getWorkOrderTypes();

    return response.render("lotOccupancy-edit", {
        headTitle:
            configFunctions.getProperty("aliases.lot") +
            " " +
            configFunctions.getProperty("aliases.occupancy") +
            "  Update",
        lotOccupancy,

        occupancyTypes,
        lotOccupantTypes,
        lotTypes,
        lotStatuses,
        maps,
        workOrderTypes,

        isCreate: false
    });
};

export default handler;
