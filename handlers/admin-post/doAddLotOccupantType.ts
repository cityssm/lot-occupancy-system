import type { Request, Response } from 'express'

import { getLotOccupantTypes } from '../../helpers/functions.cache.js'
import { addLotOccupantType } from '../../database/addLotOccupantType.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotOccupantTypeId = await addLotOccupantType(
    request.body,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success: true,
    lotOccupantTypeId,
    lotOccupantTypes
  })
}

export default handler
