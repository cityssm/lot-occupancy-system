import type { Request, Response } from 'express'

import { updateLotOccupancy } from '../../database/updateLotOccupancy.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancy(request.body, request.session.user as User)

  response.json({
    success,
    lotOccupancyId: request.body.lotOccupancyId
  })
}

