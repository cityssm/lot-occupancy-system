import type { Request, Response } from 'express'

import deleteWorkOrderLotOccupancy from '../../database/deleteWorkOrderLotOccupancy.js'
import getLotOccupancies from '../../database/getLotOccupancies.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteWorkOrderLotOccupancy(
    request.body.workOrderId as string,
    request.body.lotOccupancyId as string,
    request.session.user as User
  )

  const workOrderLotOccupancies = await getLotOccupancies(
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
    workOrderLotOccupancies: workOrderLotOccupancies.lotOccupancies
  })
}

