import type {
    RequestHandler
} from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import {
    getMaps
} from "../../helpers/lotOccupancyDB/getMaps.js";

import { getLotTypes } from "../../helpers/lotOccupancyDB/getLotTypes.js";


export const handler: RequestHandler = (_request, response) => {

    const maps = getMaps();
    const lotTypes = getLotTypes();

    response.render("lot-search", {
        headTitle: configFunctions.getProperty("aliases.lot") + " Search",
        maps,
        lotTypes
    });
};


export default handler;