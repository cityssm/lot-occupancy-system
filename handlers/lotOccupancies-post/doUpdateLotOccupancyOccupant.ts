import type { Request, Response } from 'express'

import { getLotOccupancyOccupants } from '../../database/getLotOccupancyOccupants.js'
import { updateLotOccupancyOccupant } from '../../database/updateLotOccupancyOccupant.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancyOccupant(request.body, request.session.user as User)

  const lotOccupancyOccupants = await getLotOccupancyOccupants(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyOccupants
  })
}

