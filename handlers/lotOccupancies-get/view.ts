import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";


export const handler: RequestHandler = (request, response) => {

  const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId);

  if (!lotOccupancy) {
    return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lotOccupancies/?error=lotOccupancyIdNotFound");
  }

  return response.render("lotOccupancy-view", {
    headTitle: configFunctions.getProperty("aliases.lot") + " " + configFunctions.getProperty("aliases.occupancy") + " View",
    lotOccupancy
  });
};


export default handler;
