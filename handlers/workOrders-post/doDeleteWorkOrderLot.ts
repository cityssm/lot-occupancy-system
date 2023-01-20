import type { Request, Response } from 'express'

import { deleteWorkOrderLot } from '../../helpers/lotOccupancyDB/deleteWorkOrderLot.js'
import { getLots } from '../../helpers/lotOccupancyDB/getLots.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteWorkOrderLot(
    request.body.workOrderId,
    request.body.lotId,
    request.session
  )

  const workOrderLotsResults = await getLots(
    {
      workOrderId: request.body.workOrderId
    },
    {
      limit: -1,
      offset: 0
    }
  )

  response.json({
    success,
    workOrderLots: workOrderLotsResults.lots
  })
}

export default handler
