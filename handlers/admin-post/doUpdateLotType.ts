import type { Request, Response } from 'express'

import { getLotTypes } from '../../helpers/functions.cache.js'
import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'LotTypes',
    request.body.lotTypeId,
    request.body.lotType,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
