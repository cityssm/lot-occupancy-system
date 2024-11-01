import type { Request, Response } from 'express'

import {
  moveLotTypeFieldUp,
  moveLotTypeFieldUpToTop
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
      ? await moveLotTypeFieldUpToTop(request.body.lotTypeFieldId)
      : await moveLotTypeFieldUp(request.body.lotTypeFieldId)

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}
