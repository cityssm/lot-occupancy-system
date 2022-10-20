import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getLot } from "../../helpers/lotOccupancyDB/getLot.js";

export const handler: RequestHandler = (request, response) => {
    const lot = getLot(request.params.lotId);

    if (!lot) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") + "/lots/?error=lotIdNotFound"
        );
    }

    return response.render("lot-view", {
        headTitle: lot.lotName,
        lot
    });
};

export default handler;
