import type { Request, Response } from 'express'

import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js'
import { updateLot } from '../../helpers/lotOccupancyDB/updateLot.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = Number.parseInt(request.body.lotId, 10)

  const success = await updateLot(request.body, request.session.user as User)

  response.json({
    success,
    lotId: request.body.lotId
  })

  response.on('finish', () => {
    clearNextPreviousLotIdCache(lotId)
  })
}

export default handler
