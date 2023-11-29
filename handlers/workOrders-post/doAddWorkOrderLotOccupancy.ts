import type { Request, Response } from 'express'

import { addWorkOrderLotOccupancy } from '../../helpers/lotOccupancyDB/addWorkOrderLotOccupancy.js'
import { getLotOccupancies } from '../../helpers/lotOccupancyDB/getLotOccupancies.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderLotOccupancy(
    {
      workOrderId: request.body.workOrderId,
      lotOccupancyId: request.body.lotOccupancyId
    },
    request.session.user as User
  )

  const workOrderLotOccupanciesResults = await getLotOccupancies(
    {
      workOrderId: request.body.workOrderId
    },
    {
      limit: -1,
      offset: 0,
      includeOccupants: true,
      includeFees: false,
      includeTransactions: false
    }
  )

  response.json({
    success,
    workOrderLotOccupancies: workOrderLotOccupanciesResults.lotOccupancies
  })
}

export default handler
