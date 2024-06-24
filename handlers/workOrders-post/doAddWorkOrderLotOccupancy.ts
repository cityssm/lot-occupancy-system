import type { Request, Response } from 'express'

import addWorkOrderLotOccupancy from '../../database/addWorkOrderLotOccupancy.js'
import getLotOccupancies from '../../database/getLotOccupancies.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addWorkOrderLotOccupancy(
    {
      workOrderId: request.body.workOrderId as string,
      lotOccupancyId: request.body.lotOccupancyId as string
    },
    request.session.user as User
  )

  const workOrderLotOccupanciesResults = await getLotOccupancies(
    {
      workOrderId: request.body.workOrderId as string
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
