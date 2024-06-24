import type { Request, Response } from 'express'

import updateLotTypeField, {
  type UpdateLotTypeFieldForm
} from '../../database/updateLotTypeField.js'
import { getLotTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotTypeField(
    request.body as UpdateLotTypeFieldForm,
    request.session.user as User
  )

  const lotTypes = await getLotTypes()

  response.json({
    success,
    lotTypes
  })
}
