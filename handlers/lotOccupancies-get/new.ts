import type {
    RequestHandler
} from "express";

import {
    getOccupancyTypes
} from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

import type * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (request, response) => {

    const lotOccupancy: recordTypes.LotOccupancy = {
        
    };

    const occupancyTypes = getOccupancyTypes();

    return response.render("lotOccupancy-edit", {
        headTitle: "Create a New " + configFunctions.getProperty("aliases.lot") + " " + configFunctions.getProperty("aliases.occupancy") + "  Record",
        lotOccupancy,

        occupancyTypes,
        isCreate: true
    });
};


export default handler;