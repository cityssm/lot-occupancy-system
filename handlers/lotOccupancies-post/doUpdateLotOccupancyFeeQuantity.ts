import type { Request, Response } from 'express'

import { getLotOccupancyFees } from '../../database/getLotOccupancyFees.js'
import { updateLotOccupancyFeeQuantity } from '../../database/updateLotOccupancyFeeQuantity.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateLotOccupancyFeeQuantity(
    request.body,
    request.session.user as User
  )

  const lotOccupancyFees = await getLotOccupancyFees(
    request.body.lotOccupancyId
  )

  response.json({
    success,
    lotOccupancyFees
  })
}

export default handler
