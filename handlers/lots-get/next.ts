import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getNextLotId } from "../../helpers/lotOccupancyDB/getNextLotId.js";

export const handler: RequestHandler = (request, response) => {
    const lotId = request.params.lotId;

    const nextLotId = getNextLotId(lotId);

    if (!nextLotId) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/lots/?error=noNextLotIdFound"
        );
    }

    return response.redirect(
        configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/lots/" +
            nextLotId
    );
};

export default handler;