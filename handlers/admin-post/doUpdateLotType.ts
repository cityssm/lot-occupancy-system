import type { Request, Response } from 'express'

import { updateRecord } from '../../database/updateRecord.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<unknown, unknown, { lotTypeId: string; lotType: string }>,
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
