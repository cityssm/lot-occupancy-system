import type { Request, Response } from 'express'

import { getPastLotOccupancyOccupants } from '../../database/getPastLotOccupancyOccupants.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const occupants = await getPastLotOccupancyOccupants(request.body, {
    limit: Number.parseInt(request.body.limit, 10)
  })

  response.json({
    occupants
  })
}

