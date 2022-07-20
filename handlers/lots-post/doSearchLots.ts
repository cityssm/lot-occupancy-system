import type { RequestHandler } from "express";

import { getLots } from "../../helpers/lotOccupancyDB/getLots.js";


export const handler: RequestHandler = async (request, response) => {

  const lots = getLots(request.body, {
    limit: request.body.limit,
    offset: request.body.offset
  });

  response.json({
    lots
  });
};


export default handler;