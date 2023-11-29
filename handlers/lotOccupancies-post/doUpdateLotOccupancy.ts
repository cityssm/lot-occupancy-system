import type { Request, Response } from 'express'

import { updateLotOccupancy } from '../../helpers/lotOccupancyDB/updateLotOccupancy.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancy(request.body, request.session.user as User)

  response.json({
    success,
    lotOccupancyId: request.body.lotOccupancyId
  })
}

export default handler
