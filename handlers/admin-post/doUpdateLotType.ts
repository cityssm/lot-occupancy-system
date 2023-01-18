import type { Request, Response } from 'express'

import { updateRecord } from '../../helpers/lotOccupancyDB/updateRecord.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'LotTypes',
    request.body.lotTypeId,
    request.body.lotType,
    request.session
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
