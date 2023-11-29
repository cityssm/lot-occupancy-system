import type { Request, Response } from 'express'

import { getLotTypes } from '../../helpers/functions.cache.js'
import { deleteRecord } from '../../database/deleteRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'LotTypes',
    request.body.lotTypeId,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
