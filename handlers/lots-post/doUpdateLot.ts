import type { Request, Response } from 'express'

import { updateLot } from '../../helpers/lotOccupancyDB/updateLot.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLot(request.body, request.session)

  response.json({
    success,
    lotId: request.body.lotId
  })
}

export default handler
