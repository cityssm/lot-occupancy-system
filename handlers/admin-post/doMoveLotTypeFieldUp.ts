import type { Request, Response } from 'express'

import {
  moveLotTypeFieldUp,
  moveLotTypeFieldUpToTop
} from '../../helpers/lotOccupancyDB/moveLotTypeField.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
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

export default handler
