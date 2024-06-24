import type { Request, Response } from 'express'

import { updateWorkOrder } from '../../database/updateWorkOrder.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrder(
    request.body,
    request.session.user as User
  )

  response.json({
    success,
    workOrderId: request.body.workOrderId
  })
}

