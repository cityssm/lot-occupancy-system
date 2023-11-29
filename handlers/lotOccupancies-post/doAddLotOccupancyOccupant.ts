import type { Request, Response } from 'express'

import { addLotOccupancyOccupant } from '../../database/addLotOccupancyOccupant.js'
import { getLotOccupancyOccupants } from '../../database/getLotOccupancyOccupants.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyOccupant(request.body, request.session.user as User)

  const lotOccupancyOccupants = await getLotOccupancyOccupants(
    request.body.lotOccupancyId
  )

  response.json({
    success: true,
    lotOccupancyOccupants
  })
}

export default handler
