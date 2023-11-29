import type { Request, Response } from 'express'

import { getLotTypes } from '../../helpers/functions.cache.js'
import { addLotTypeField } from '../../helpers/lotOccupancyDB/addLotTypeField.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotTypeFieldId = await addLotTypeField(
    request.body,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success: true,
    lotTypeFieldId,
    lotTypes
  })
}

export default handler
