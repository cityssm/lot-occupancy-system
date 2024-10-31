import type { Request, Response } from 'express'

import { updateRecord } from '../../database/updateRecord.js'
import { getLotStatuses } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { lotStatusId: string; lotStatus: string }
  >,
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
