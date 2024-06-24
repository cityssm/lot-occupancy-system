import type { Request, Response } from 'express'

import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js'
import { updateLot } from '../../database/updateLot.js'

export default async function handler(
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

