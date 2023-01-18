import type { Request, Response } from 'express'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = deleteRecord(
    'WorkOrders',
    request.body.workOrderId,
    request.session
  )

  response.json({
    success
  })
}

export default handler
