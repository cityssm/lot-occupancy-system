import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { lotTypeId: string; moveToEnd: '0' | '1' }
  >,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom('LotTypes', request.body.lotTypeId)
      : await moveRecordDown('LotTypes', request.body.lotTypeId)

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}
