import type { Request, Response } from 'express'

import { reopenWorkOrder } from '../../database/reopenWorkOrder.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await reopenWorkOrder(request.body.workOrderId, request.session.user as User)

  response.json({
    success,
    workOrderId: request.body.workOrderId
  })
}

export default handler
