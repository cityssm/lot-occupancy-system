import type { Request, Response } from 'express'

import { updateLotStatus } from '../../helpers/lotOccupancyDB/updateLot.js'
import { getLots } from '../../helpers/lotOccupancyDB/getLots.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotStatus(
    request.body.lotId,
    request.body.lotStatusId,
    request.session
  )

  const workOrderLotsResults = await getLots(
    {
      workOrderId: request.body.workOrderId
    },
    {
      limit: -1,
      offset: 0,
      includeLotOccupancyCount: true
    }
  )

  response.json({
    success,
    workOrderLots: workOrderLotsResults.lots
  })
}

export default handler
