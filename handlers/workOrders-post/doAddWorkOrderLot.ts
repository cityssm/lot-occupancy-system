import type { Request, Response } from 'express'

import { addWorkOrderLot } from '../../helpers/lotOccupancyDB/addWorkOrderLot.js'
import { getLots } from '../../helpers/lotOccupancyDB/getLots.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderLot(
    {
      workOrderId: request.body.workOrderId,
      lotId: request.body.lotId
    },
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
