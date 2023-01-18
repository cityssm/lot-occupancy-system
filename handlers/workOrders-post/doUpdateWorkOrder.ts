import type { Request, Response } from 'express'

import { updateWorkOrder } from '../../helpers/lotOccupancyDB/updateWorkOrder.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = updateWorkOrder(request.body, request.session)

  response.json({
    success,
    workOrderId: request.body.workOrderId
  })
}

export default handler
