import type { Request, Response } from 'express'
import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js'

import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = Number.parseInt(request.body.lotId, 10)

  const success = await deleteRecord('Lots', lotId, request.session)

  response.json({
    success
  })

  response.on('finish', () => {
    clearNextPreviousLotIdCache(lotId)
  })
}

export default handler
