import type { Request, Response } from 'express'

import updateWorkOrder, {
  type UpdateWorkOrderForm
} from '../../database/updateWorkOrder.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateWorkOrder(
    request.body as UpdateWorkOrderForm,
    request.session.user as User
  )

  response.json({
    success,
    workOrderId: request.body.workOrderId as string
  })
}
