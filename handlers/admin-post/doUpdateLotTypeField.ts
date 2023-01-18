import type { Request, Response } from 'express'

import { updateLotTypeField } from '../../helpers/lotOccupancyDB/updateLotTypeField.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotTypeField(request.body, request.session)

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

export default handler
