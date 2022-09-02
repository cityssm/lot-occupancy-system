import type { RequestHandler } from "express";

import { deleteLotOccupancyOccupant } from "../../helpers/lotOccupancyDB/deleteLotOccupancyOccupant.js";

import { getLotOccupancyOccupants } from "../../helpers/lotOccupancyDB/getLotOccupancyOccupants.js";

export const handler: RequestHandler = async (request, response) => {
    const success = deleteLotOccupancyOccupant(
        request.body.lotOccupancyId,
        request.body.lotOccupantIndex,
        request.session
    );

    const lotOccupancyOccupants = getLotOccupancyOccupants(
        request.body.lotOccupancyId
    );

    response.json({
        success,
        lotOccupancyOccupants
    });
};

export default handler;
