import type { Request, Response } from 'express'

import deleteWorkOrderLot from '../../database/deleteWorkOrderLot.js'
import getLots from '../../database/getLots.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteWorkOrderLot(
    request.body.workOrderId as string,
    request.body.lotId as string,
    request.session.user as User
  )

  const workOrderLotsResults = await getLots(
    {
      workOrderId: request.body.workOrderId as string
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
