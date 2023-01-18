import type { Request, Response } from 'express'

import { updateLotOccupantType } from '../../helpers/lotOccupancyDB/updateLotOccupantType.js'

import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupantType(request.body, request.session)

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success,
    lotOccupantTypes
  })
}

export default handler
