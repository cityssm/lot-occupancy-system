import type { Request, Response } from 'express'

import { updateLotOccupancyFeeQuantity } from '../../helpers/lotOccupancyDB/updateLotOccupancyFeeQuantity.js'

import { getLotOccupancyFees } from '../../helpers/lotOccupancyDB/getLotOccupancyFees.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancyFeeQuantity(
    request.body,
    request.session
  )

  const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId)

  response.json({
    success,
    lotOccupancyFees
  })
}

export default handler
