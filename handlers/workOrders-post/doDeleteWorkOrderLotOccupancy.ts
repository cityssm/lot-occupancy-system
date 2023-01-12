import type { RequestHandler } from 'express'

import { deleteWorkOrderLotOccupancy } from '../../helpers/lotOccupancyDB/deleteWorkOrderLotOccupancy.js'
import { getLotOccupancies } from '../../helpers/lotOccupancyDB/getLotOccupancies.js'

export const handler: RequestHandler = (request, response) => {
  const success = deleteWorkOrderLotOccupancy(
    request.body.workOrderId,
    request.body.lotOccupancyId,
    request.session
  )

  const workOrderLotOccupancies = getLotOccupancies(
    {
      workOrderId: request.body.workOrderId
    },
    {
      limit: -1,
      offset: 0,
      includeOccupants: true
    }
  ).lotOccupancies

  response.json({
    success,
    workOrderLotOccupancies
  })
}

export default handler
