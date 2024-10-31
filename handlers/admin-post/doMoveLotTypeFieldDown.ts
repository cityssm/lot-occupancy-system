import type { Request, Response } from 'express'

import {
  moveLotTypeFieldDown,
  moveLotTypeFieldDownToBottom
} from '../../database/moveLotTypeField.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request<
    unknown,
    unknown,
    { lotTypeFieldId: string; moveToEnd: '0' | '1' }
  >,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveLotTypeFieldDownToBottom(request.body.lotTypeFieldId)
      : await moveLotTypeFieldDown(request.body.lotTypeFieldId)

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}
