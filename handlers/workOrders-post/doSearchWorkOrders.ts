import type { RequestHandler } from 'express'

import { getWorkOrders } from '../../helpers/lotOccupancyDB/getWorkOrders.js'

export const handler: RequestHandler = (request, response) => {
  const result = getWorkOrders(request.body, {
    limit: request.body.limit,
    offset: request.body.offset,
    includeLotsAndLotOccupancies: true
  })

  response.json({
    count: result.count,
    offset: Number.parseInt(request.body.offset, 10),
    workOrders: result.workOrders
  })
}

export default handler
