import type { Request, Response } from 'express'

import { getLotOccupantTypes } from '../../helpers/functions.cache.js'
import { deleteRecord } from '../../database/deleteRecord.js'

export async function handler(
  request: Request,
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

export default handler
