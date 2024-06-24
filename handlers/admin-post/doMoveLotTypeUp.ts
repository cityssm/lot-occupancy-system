import type { Request, Response } from 'express'

import {
  moveRecordUp,
  moveRecordUpToTop
} from '../../database/moveRecord.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop('LotTypes', request.body.lotTypeId)
      : await moveRecordUp('LotTypes', request.body.lotTypeId)

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

