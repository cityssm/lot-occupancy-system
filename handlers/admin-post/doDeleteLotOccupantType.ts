import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotOccupantTypes',
    request.body.lotOccupantTypeId as string,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}
