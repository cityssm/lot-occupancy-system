import type { RequestHandler } from 'express'

import { updateWorkOrder } from '../../helpers/lotOccupancyDB/updateWorkOrder.js'

export const handler: RequestHandler = (request, response) => {
  const success = updateWorkOrder(request.body, request.session)

  response.json({
    success,
    workOrderId: request.body.workOrderId
  })
}

export default handler
