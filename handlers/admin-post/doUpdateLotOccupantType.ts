import type { Request, Response } from 'express'

import { getLotOccupantTypes } from '../../helpers/functions.cache.js'
import { updateLotOccupantType } from '../../database/updateLotOccupantType.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupantType(
    request.body,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}

