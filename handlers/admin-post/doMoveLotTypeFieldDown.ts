import type { Request, Response } from 'express'

import {
  moveLotTypeFieldDown,
  moveLotTypeFieldDownToBottom
} from '../../database/moveLotTypeField.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
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

export default handler
