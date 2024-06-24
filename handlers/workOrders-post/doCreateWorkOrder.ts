import type { Request, Response } from 'express'

import addWorkOrder, {
  type AddWorkOrderForm
} from '../../database/addWorkOrder.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderId = await addWorkOrder(
    request.body as AddWorkOrderForm,
    request.session.user as User
  )

  response.json({
    success: true,
    workOrderId
  })
}

