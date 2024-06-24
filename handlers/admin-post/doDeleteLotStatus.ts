import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getLotStatuses } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotStatuses',
    request.body.lotStatusId as string,
    request.session.user as User
  )

  const lotStatuses = await getLotStatuses()

  response.json({
    success,
    lotStatuses
  })
}
