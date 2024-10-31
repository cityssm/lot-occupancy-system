import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<unknown, unknown, { lotOccupantTypeId: string }>,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotOccupantTypes',
    request.body.lotOccupantTypeId,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}
