import type { Request, Response } from 'express'

import { getLotStatuses } from '../../helpers/functions.cache.js'
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotStatuses',
    request.body.lotStatusId,
    request.session.user as User
  )

  const lotStatuses = await getLotStatuses()

  response.json({
    success,
    lotStatuses
  })
}

export default handler
