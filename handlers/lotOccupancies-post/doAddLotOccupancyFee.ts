import type { Request, Response } from 'express'

import { addLotOccupancyFee } from '../../database/addLotOccupancyFee.js'
import { getLotOccupancyFees } from '../../database/getLotOccupancyFees.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  await addLotOccupancyFee(request.body, request.session.user as User)

  const lotOccupancyFees = await getLotOccupancyFees(request.body.lotOccupancyId)

  response.json({
    success: true,
    lotOccupancyFees
  })
}

export default handler
