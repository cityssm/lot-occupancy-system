import type { Request, Response } from 'express'

import reopenWorkOrder from '../../database/reopenWorkOrder.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await reopenWorkOrder(
    request.body.workOrderId as string,
    request.session.user as User
  )

  response.json({
    success,
    workOrderId: request.body.workOrderId as string
  })
}
