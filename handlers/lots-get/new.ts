import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";

import * as recordTypes from "../../types/recordTypes";


export const handler: RequestHandler = (_request, response) => {

  const lot: recordTypes.Lot = {
    lotOccupancies: []
  };

  const maps = getMaps();
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
