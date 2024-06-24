import type { Request, Response } from 'express'

import { updateRecord } from '../../database/updateRecord.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateRecord(
    'LotTypes',
    request.body.lotTypeId as string,
    request.body.lotType as string,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

