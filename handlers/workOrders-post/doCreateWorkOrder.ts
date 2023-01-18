import type { Request, Response } from 'express'

import { addWorkOrder } from '../../helpers/lotOccupancyDB/addWorkOrder.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderId = addWorkOrder(request.body, request.session)

  response.json({
    success: true,
    workOrderId
  })
}

export default handler
