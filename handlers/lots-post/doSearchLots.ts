import type { RequestHandler } from "express";

import { getLots } from "../../helpers/lotOccupancyDB/getLots.js";


export const handler: RequestHandler = async (request, response) => {

  const result = getLots(request.body, {
    limit: request.body.limit,
    offset: request.body.offset
  });

  response.json({
    count: result.count,
    lots: result.lots
  });
};


export default handler;