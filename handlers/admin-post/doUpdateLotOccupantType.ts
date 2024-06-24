import type { Request, Response } from 'express'

import updateLotOccupantType, {
  type UpdateLotOccupantTypeForm
} from '../../database/updateLotOccupantType.js'
import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupantType(
    request.body as UpdateLotOccupantTypeForm,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}
