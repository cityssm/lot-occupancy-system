import type { RequestHandler } from 'express'

import { closeWorkOrder } from '../../helpers/lotOccupancyDB/closeWorkOrder.js'

export const handler: RequestHandler = (request, response) => {
  const success = closeWorkOrder(request.body, request.session)

  response.json({
    success
  })
}

export default handler
