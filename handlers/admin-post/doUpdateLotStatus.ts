import type { Request, Response } from 'express'

import { getLotStatuses } from '../../helpers/functions.cache.js'
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'LotStatuses',
    request.body.lotStatusId,
    request.body.lotStatus,
    request.session.user as User
  )

  const lotStatuses = await getLotStatuses()

  response.json({
    success,
    lotStatuses
  })
}

export default handler
