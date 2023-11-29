import type { Request, Response } from 'express'

import { closeWorkOrder } from '../../database/closeWorkOrder.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await closeWorkOrder(request.body, request.session.user as User)

  response.json({
    success
  })
}

export default handler
