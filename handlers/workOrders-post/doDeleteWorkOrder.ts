import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrders',
    request.body.workOrderId,
    request.session.user as User
  )

  response.json({
    success
  })
}

export default handler
