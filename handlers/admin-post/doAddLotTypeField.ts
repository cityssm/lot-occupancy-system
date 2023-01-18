import type { Request, Response } from 'express'

import { addLotTypeField } from '../../helpers/lotOccupancyDB/addLotTypeField.js'

import { getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotTypeFieldId = await addLotTypeField(request.body, request.session)

  const lotTypes = await getLotTypes()

  response.json({
    success: true,
    lotTypeFieldId,
    lotTypes
  })
}

export default handler
