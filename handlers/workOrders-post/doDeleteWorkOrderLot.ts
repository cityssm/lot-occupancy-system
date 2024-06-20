import type { Request, Response } from 'express'

import deleteWorkOrderLot from '../../database/deleteWorkOrderLot.js'
import { getLots } from '../../database/getLots.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteWorkOrderLot(
    request.body.workOrderId,
    request.body.lotId,
    request.session.user as User
  )

  const workOrderLotsResults = await getLots(
    {
      workOrderId: request.body.workOrderId
    },
    {
      limit: -1,
      offset: 0,
      includeLotOccupancyCount: false
    }
  )

  response.json({
    success,
    workOrderLots: workOrderLotsResults.lots
  })
}

export default handler
