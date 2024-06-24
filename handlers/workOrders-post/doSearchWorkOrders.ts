import type { Request, Response } from 'express'

import { getWorkOrders } from '../../database/getWorkOrders.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const result = await getWorkOrders(request.body, {
    limit: request.body.limit,
    offset: request.body.offset,
    includeLotsAndLotOccupancies: true
  })

  response.json({
    count: result.count,
    offset: Number.parseInt(request.body.offset, 10),
    workOrders: result.workOrders
  })
}

