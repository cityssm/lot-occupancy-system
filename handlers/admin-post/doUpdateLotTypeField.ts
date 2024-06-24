import type { Request, Response } from 'express'

import { getLotTypes } from '../../helpers/functions.cache.js'
import { updateLotTypeField } from '../../database/updateLotTypeField.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotTypeField(
    request.body,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}

