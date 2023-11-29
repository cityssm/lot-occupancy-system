import type { Request, Response } from 'express'

import { getLotTypes } from '../../helpers/functions.cache.js'
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotTypeFields',
    request.body.lotTypeFieldId,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
