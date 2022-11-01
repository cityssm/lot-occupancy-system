import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";

import * as recordTypes from "../../types/recordTypes";

export const handler: RequestHandler = (request, response) => {
    const lot: recordTypes.Lot = {
        lotId: -1,
        lotOccupancies: []
    };

    const maps = getMaps();

    if (request.query.mapId) {
        const mapId = Number.parseInt(request.query.mapId as string, 10);

        const map = maps.find((possibleMap) => {
            return mapId === possibleMap.mapId;
        });

        if (map) {
            lot.mapId = map.mapId;
            lot.mapName = map.mapName;
        }
    }

    const lotTypes = cacheFunctions.getLotTypes();
    const lotStatuses = cacheFunctions.getLotStatuses();

    response.render("lot-edit", {
        headTitle: "Create a New " + configFunctions.getProperty("aliases.lot"),
        lot,
        isCreate: true,
        maps,
        lotTypes,
        lotStatuses
    });
};

export default handler;
