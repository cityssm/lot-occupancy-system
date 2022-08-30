import type {
    RequestHandler
} from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import {
    getPreviousLotId
} from "../../helpers/lotOccupancyDB/getPreviousLotId.js";


export const handler: RequestHandler = (request, response) => {

    const lotId = request.params.lotId;

    const previousLotId = getPreviousLotId(lotId);

    if (!previousLotId) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lots/?error=noPreviousLotIdFound");
    }

    return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lots/" + previousLotId);
};


export default handler;