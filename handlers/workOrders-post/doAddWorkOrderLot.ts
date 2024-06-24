import type { Request, Response } from 'express'

import addWorkOrderLot from '../../database/addWorkOrderLot.js'
import getLots from '../../database/getLots.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderLot(
    {
      workOrderId: request.body.workOrderId as string,
      lotId: request.body.lotId as string
    },
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
