import type { Request, Response } from 'express'

import { addWorkOrder } from '../../database/addWorkOrder.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderId = await addWorkOrder(request.body, request.session.user as User)

  response.json({
    success: true,
    workOrderId
  })
}

export default handler
